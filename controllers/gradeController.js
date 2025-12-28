const gradeDb = require("../models/Grade");
const studentDb = require("../models/Student");
const accountDb = require("../models/Account");
const API_PORT = process.env.PORT || 3001;
const gradebookDb = require("../models/Gradebook");
const {
    verifyKey
} = require("./verifyController");
const {
    processAnnouncements
} = require("./processAnnouncements");
module.exports = {
    getGrades: function (req, res) {
        verifyKey(req.header('Authorization'), 'Admin')
            .then((isVerified) => {
                if (isVerified) {
                    console.log('🔍 getGrades called - fetching all grades');
                    gradeDb
                        .find({})
                        .populate('subjectTeacherAssignments.subject')
                        .populate('subjectTeacherAssignments.teacher')
                        .then(gradeDocs => {
                            console.log('📊 Grades fetched:', gradeDocs.map(g => ({
                                level: g.level,
                                section: g.section,
                                assignments: g.subjectTeacherAssignments?.length || 0,
                                students: g.students?.length || 0
                            })));
                            
                            res.json(gradeDocs);
                        })
                        .catch(err => res.status(422).json(err));

                } else {
                    res.status(403).json(null);
                }
            })
    },
    getUserGrade: function (req, res) {
        verifyKey(req.header('Authorization'), 'Student,Teacher,Admin')
            .then((isVerified) => {
                if (isVerified) {

                    const uid = req.params.uid;

                    gradeDb
                        .findOne({
                            $or: [{
                                    students: {
                                        $in: [uid]
                                    }
                                },
                                {
                                    teachers: {
                                        $in: [uid]
                                    }
                                }
                            ]
                        })
                        .populate({
                            path: 'subjects',
                            populate: {
                                path: 'announcements',
                                populate: {
                                    path: 'files'
                                }
                            }
                        })

                        .then(async (gradeDoc) => {

                            if (!gradeDoc) {
                                res.json(null)

                                return
                            }
                            // Replace files for announcements
                            for (let i = 0; i < gradeDoc.subjects.length; i++) {
                                const currentSubject = gradeDoc.subjects[i]

                                currentSubject.announcements = processAnnouncements(currentSubject.announcements)
                            }


                            // Replace students with student object (names, etc)
                            for (let i = 0; i < gradeDoc.students.length; i++) {
                                const currentStudent = gradeDoc.students[i];
                                const studentDoc = await studentDb.findById(currentStudent);
                                const accountDoc = await accountDb.findOne({
                                    profile: currentStudent
                                });

                                gradeDoc.students[i] = {
                                    firstName: studentDoc["first_name"],
                                    lastName: studentDoc["last_name"],
                                    id: studentDoc["_id"],
                                    username: accountDoc["username"],
                                    password: accountDoc["password"]
                                };
                            };

                            res.json(gradeDoc)
                        })
                        .catch(err => res.status(422).json(err));

                } else {
                    res.status(403).json(null);
                }
            })
    },
    getGrade: function (req, res) {
        verifyKey(req.header('Authorization'), 'Admin')
            .then((isVerified) => {
                if (isVerified) {

                    gradeDb
                        .findOne({
                            _id: req.params.gid
                        })
                        .populate('subjects')
                        .populate('teachers')
                        .populate('students')
                        .then(gradeDoc => res.json(gradeDoc))
                        .catch(err => res.status(422).json(err));

                } else {
                    res.status(403).json(null);
                }
            })
    },
    addGrade: function (req, res) {
        console.log('🚀 addGrade endpoint called');
        console.log('🔐 Authorization header:', req.header('Authorization') ? 'Present' : 'Missing');

        verifyKey(req.header('Authorization'), 'Admin')
            .then((isVerified) => {
                console.log('🔑 Authorization verified:', isVerified);
                if (!isVerified) {
                    return res.status(403).json(null);
                }

                const gradeDoc = req.body;
                console.log('🔹 Received grade data:', JSON.stringify(gradeDoc, null, 2));

                if (gradeDoc.level === undefined || gradeDoc.level === null || gradeDoc.level === '') {
                    console.error('❌ Grade level is missing from request:', gradeDoc.level);
                    return res.status(400).json({
                        error: 'Grade level is required',
                        received: gradeDoc
                    });
                }

                gradeDoc.level = parseInt(gradeDoc.level, 10);
                if (Number.isNaN(gradeDoc.level) || gradeDoc.level < 1) {
                    console.error('❌ Invalid grade level:', gradeDoc.level);
                    return res.status(400).json({
                        error: 'Grade level must be a positive number',
                        received: gradeDoc.level
                    });
                }

                console.log('✅ Validated grade data');

                const studentsToUpdate = Array.isArray(gradeDoc.students) ? gradeDoc.students : [];
                return gradeDb.updateMany(
                        { students: { $in: studentsToUpdate } },
                        { $pull: { students: { $in: studentsToUpdate } } }
                    )
                    .then(() => {
                        console.log('💾 About to create grade in database');
                        return gradeDb.create(gradeDoc);
                    })
                    .then(async (newG) => {
                        console.log('✅ Grade successfully created:', newG._id);

                        try {
                            const subjects = Array.isArray(newG.subjectTeacherAssignments)
                                ? newG.subjectTeacherAssignments
                                    .map((assignment) => assignment.subject)
                                    .filter(Boolean)
                                : [];
                            const gradebookEntries = [];

                            if (subjects.length > 0 && Array.isArray(newG.students) && newG.students.length > 0) {
                                for (const studentId of newG.students) {
                                    const studentDoc = await studentDb.findById(studentId);
                                    if (!studentDoc) {
                                        continue;
                                    }
                                    const studentName = `${studentDoc.first_name} ${studentDoc.last_name}`.trim();

                                    for (const subjectId of subjects) {
                                        gradebookEntries.push({
                                            subjectId,
                                            gradeId: newG._id,
                                            studentId,
                                            studentName,
                                            grades: []
                                        });
                                    }
                                }
                            }

                            if (gradebookEntries.length > 0) {
                                await gradebookDb.insertMany(gradebookEntries, { ordered: false });
                            }
                        } catch (err) {
                            console.error('Error creating gradebook entries:', err);
                        }

                        return res.json(newG);
                    })
                    .catch(err => {
                        console.error('Grade creation error:', err);

                        if (err.code === 11000 && err.keyPattern && err.keyPattern.level && err.keyPattern.section) {
                            const duplicateLevel = err.keyValue.level;
                            const duplicateSection = err.keyValue.section;
                            return res.status(422).json({
                                error: `Grade ${duplicateLevel} Section ${duplicateSection} already exists. Please use a different section letter.`,
                                type: 'duplicate_grade_section',
                                level: duplicateLevel,
                                section: duplicateSection
                            });
                        }

                        return res.status(422).json(err);
                    });
            })
            .catch(err => {
                console.error('Unexpected error in addGrade:', err);
                res.status(500).json({ error: 'Unexpected error while creating grade.' });
            });
    },

    updateGrade: function (req, res) {
        console.log('🔄 updateGrade endpoint called');
        console.log('📝 Update data received:', JSON.stringify(req.body, null, 2));

        verifyKey(req.header('Authorization'), 'Admin')
            .then((isVerified) => {
                if (!isVerified) {
                    return res.status(403).json(null);
                }

                const gradeDoc = req.body;
                let originalGrade;

                console.log('🔍 Finding original grade:', gradeDoc._id);

                return gradeDb.findById(gradeDoc._id)
                    .then(oldGradeDoc => {
                        if (!oldGradeDoc) {
                            throw new Error('Grade not found');
                        }
                        originalGrade = oldGradeDoc;
                        console.log('📊 Original grade data:', {
                            level: oldGradeDoc.level,
                            section: oldGradeDoc.section,
                            students: Array.isArray(oldGradeDoc.students) ? oldGradeDoc.students.length : 0,
                            teachers: Array.isArray(oldGradeDoc.teachers) ? oldGradeDoc.teachers.length : 0,
                            subjects: Array.isArray(oldGradeDoc.subjects) ? oldGradeDoc.subjects.length : 0
                        });
                        console.log('📊 New grade data:', {
                            level: gradeDoc.level,
                            section: gradeDoc.section,
                            students: Array.isArray(gradeDoc.students) ? gradeDoc.students.length : 0,
                            teachers: Array.isArray(gradeDoc.teachers) ? gradeDoc.teachers.length : 0,
                            subjects: Array.isArray(gradeDoc.subjects) ? gradeDoc.subjects.length : 0
                        });

                        const studentsToUpdate = Array.isArray(gradeDoc.students) ? gradeDoc.students : [];
                        return gradeDb.updateMany(
                            {
                                _id: { $ne: gradeDoc._id },
                                students: { $in: studentsToUpdate }
                            },
                            {
                                $pull: { students: { $in: studentsToUpdate } }
                            }
                        );
                    })
                    .then(() => {
                        console.log('💾 Updating grade document');
                        return gradeDb.findOneAndUpdate(
                            { _id: gradeDoc._id },
                            gradeDoc,
                            { new: true }
                        );
                    })
                    .then(async (updatedGrade) => {
                        if (!updatedGrade) {
                            throw new Error('Unable to update grade');
                        }
                        console.log('✅ Grade updated:', updatedGrade._id);

                        try {
                            const updatedSubjects = Array.isArray(updatedGrade.subjectTeacherAssignments)
                                ? updatedGrade.subjectTeacherAssignments
                                    .map((assignment) => assignment.subject)
                                    .filter(Boolean)
                                : [];
                            const originalSubjects = Array.isArray(originalGrade.subjectTeacherAssignments)
                                ? originalGrade.subjectTeacherAssignments
                                    .map((assignment) => assignment.subject.toString())
                                : [];

                            const newStudents = (updatedGrade.students || []).filter(
                                (studentId) => !originalGrade.students.some((id) => id.toString() === studentId.toString())
                            );
                            const existingStudents = (updatedGrade.students || []).filter(
                                (studentId) => originalGrade.students.some((id) => id.toString() === studentId.toString())
                            );
                            const newlyAddedSubjects = updatedSubjects.filter(
                                (subjectId) => !originalSubjects.includes(subjectId.toString())
                            );

                            const gradebookEntries = [];

                            if (newStudents.length > 0 && updatedSubjects.length > 0) {
                                for (const studentId of newStudents) {
                                    const studentDoc = await studentDb.findById(studentId);
                                    if (!studentDoc) {
                                        continue;
                                    }
                                    const studentName = `${studentDoc.first_name} ${studentDoc.last_name}`.trim();

                                    for (const subjectId of updatedSubjects) {
                                        gradebookEntries.push({
                                            subjectId,
                                            gradeId: updatedGrade._id,
                                            studentId,
                                            studentName,
                                            grades: []
                                        });
                                    }
                                }
                            }

                            if (existingStudents.length > 0 && newlyAddedSubjects.length > 0) {
                                for (const studentId of existingStudents) {
                                    const studentDoc = await studentDb.findById(studentId);
                                    if (!studentDoc) {
                                        continue;
                                    }
                                    const studentName = `${studentDoc.first_name} ${studentDoc.last_name}`.trim();

                                    for (const subjectId of newlyAddedSubjects) {
                                        gradebookEntries.push({
                                            subjectId,
                                            gradeId: updatedGrade._id,
                                            studentId,
                                            studentName,
                                            grades: []
                                        });
                                    }
                                }
                            }

                            if (gradebookEntries.length > 0) {
                                await gradebookDb.insertMany(gradebookEntries, { ordered: false });
                            }
                        } catch (err) {
                            console.error('Error updating gradebook entries:', err);
                        }

                        return res.json(updatedGrade);
                    });
            })
            .catch(err => {
                console.error('❌ Error in updateGrade:', err);
                res.status(422).json(err.message ? { error: err.message } : err);
            });
    },

    deleteGrade: function (req, res) {
        verifyKey(req.header('Authorization'), 'Admin')
            .then((isVerified) => {
                if (isVerified) {
                    const gid = req.params.gid;

                    gradeDb
                        .findOneAndDelete({
                            _id: gid
                        })
                        .then(() => {

                            res.json({});

                        })
                        .catch(err => res.status(422).json(err));

                } else {
                    res.status(403).json(null);
                }
            })
    },
    // updateGradeStatus: function (req, res) {
    //     verifyKey(req.header('Authorization'), 'Admin')
    //         .then((isVerified) => {
    //             if (isVerified) {
    //                 const { gid, status } = req.params;
    
    //                 gradeDb
    //                     .findOneAndUpdate({ _id: gid }, { status: status })
    //                     .then(updatedGrade => res.json(updatedGrade))
    //                     .catch(err => res.status(422).json(err));
    //             } else {
    //                 res.status(403).json(null);
    //             }
    //         })
    // }
    // addStudent: function (req, res) {
    //     verifyKey(req.header('Authorization'), 'Admin')
    //         .then((isVerified) => {
    //             if (isVerified) {
    //                 const gid = req.params.gid;
    //                 const sid = req.params.sid;

    //                 gradeDb
    //                     .findOneAndUpdate({
    //                         _id: gid
    //                     }, {
    //                         $push: {
    //                             students: sid
    //                         }
    //                     })
    //                     .then(newG => res.json(newG))
    //                     .catch(err => res.status(422).json(err));
    //             } else {
    //                 res.status(403).json(null);
    //             }
    //         })
    // },
    // removeStudent: function (req, res) {
    //     verifyKey(req.header('Authorization'), 'Admin')
    //         .then((isVerified) => {
    //             if (isVerified) {
    //                 const gid = req.params.gid;
    //                 const sid = req.params.sid;

    //                 gradeDb
    //                     .findOneAndUpdate({
    //                         _id: gid
    //                     }, {
    //                         $pull: {
    //                             students: sid
    //                         }
    //                     })
    //                     .then(newG => res.json(newG))
    //                     .catch(err => res.status(422).json(err));
    //             } else {
    //                 res.status(403).json(null);
    //             }
    //         })
    // },
    // addTeacher: function (req, res) {
    //     verifyKey(req.header('Authorization'), 'Admin')
    //         .then((isVerified) => {
    //             if (isVerified) {
    //                 const gid = req.params.gid;
    //                 const tid = req.params.tid;

    //                 gradeDb
    //                     .findOneAndUpdate({
    //                         _id: gid
    //                     }, {
    //                         $push: {
    //                             teachers: tid
    //                         }
    //                     })
    //                     .then(newG => res.json(newG))
    //                     .catch(err => res.status(422).json(err));
    //             } else {
    //                 res.status(403).json(null);
    //             }
    //         })
    // },
    // removeTeacher: function (req, res) {
    //     verifyKey(req.header('Authorization'), 'Admin')
    //         .then((isVerified) => {
    //             if (isVerified) {
    //                 const gid = req.params.gid;
    //                 const tid = req.params.tid;

    //                 gradeDb
    //                     .findOneAndUpdate({
    //                         _id: gid
    //                     }, {
    //                         $pull: {
    //                             teachers: tid
    //                         }
    //                     })
    //                     .then(newG => res.json(newG))
    //                     .catch(err => res.status(422).json(err));
    //             } else {
    //                 res.status(403).json(null);
    //             }
    //         })
    // },
    // addSubject: function (req, res) {
    //     verifyKey(req.header('Authorization'), 'Admin')
    //         .then((isVerified) => {
    //             if (isVerified) {
    //                 const gid = req.params.gid;
    //                 const sid = req.params.sid;

    //                 gradeDb
    //                     .findOneAndUpdate({
    //                         _id: gid
    //                     }, {
    //                         $push: {
    //                             subjects: sid
    //                         }
    //                     })
    //                     .then(newG => res.json(newG))
    //                     .catch(err => res.status(422).json(err));
    //             } else {
    //                 res.status(403).json(null);
    //             }
    //         })
    // },
    // removeSubject: function (req, res) {
    //     verifyKey(req.header('Authorization'), 'Admin')
    //         .then((isVerified) => {
    //             if (isVerified) {
    //                 const gid = req.params.gid;
    //                 const sid = req.params.sid;

    //                 gradeDb
    //                     .findOneAndUpdate({
    //                         _id: gid
    //                     }, {
    //                         $pull: {
    //                             subjects: sid
    //                         }
    //                     })
    //                     .then(newG => res.json(newG))
    //                     .catch(err => res.status(422).json(err));
    //             } else {
    //                 res.status(403).json(null);
    //             }
    //         })
    // },
}