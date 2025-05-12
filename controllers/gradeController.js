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
                    gradeDb
                        .find({})
                        .populate('subjects')
                        .then(gradeDocs => res.json(gradeDocs))
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
        verifyKey(req.header('Authorization'), 'Admin')
            .then((isVerified) => {
                if (isVerified) {
                    // Create folder
                    let gradeDoc = req.body;
                    
                    // Find all grades whose field 'students'/'teachers'/'subjects' has an identical _id in newG's corresponding fields and pull that _id the respective field 
                    gradeDb.updateMany({
                                $or: [{
                                        students: {
                                            $in: gradeDoc.students
                                        }
                                    },
                                    {
                                        teachers: {
                                            $in: gradeDoc.teachers
                                        }
                                    },
                                    {
                                        subjects: {
                                            $in: gradeDoc.subjects
                                        }
                                    },
                                ]
                            }, {
                                $pull: {
                                    students: {
                                        $in: gradeDoc.students
                                    },
                                    teachers: {
                                        $in: gradeDoc.teachers
                                    },
                                    subjects: {
                                        $in: gradeDoc.subjects
                                    }
                                }
                            }
                        )
                        .then(() => {
                            // Create class document 
                            gradeDb
                                .create(gradeDoc)
                                .then(async (newG) => {
                                    // Create gradebook entries for each student and subject
                                    try {
                                        const gradebookEntries = [];
                                        
                                        // For each student in the grade
                                        for (const studentId of newG.students) {
                                            // First get student name from database
                                            const studentDoc = await studentDb.findById(studentId);
                                            const studentName = `${studentDoc.first_name} ${studentDoc.last_name}`;
                                            
                                            // For each subject in the grade
                                            for (const subjectId of newG.subjects) {
                                                // Create a gradebook entry
                                                gradebookEntries.push({
                                                    subjectId: subjectId,
                                                    gradeId: newG._id,
                                                    studentId: studentId,
                                                    studentName: studentName,
                                                    grades: [] // Initialize with empty grades array
                                                });
                                            }
                                        }
                                        
                                        // Only create entries if there are both students and subjects
                                        if (gradebookEntries.length > 0) {
                                            // Use insertMany to efficiently create all entries at once
                                            // Set ordered: false to continue insertion even if some entries fail (due to duplicates)
                                            await gradebookDb.insertMany(gradebookEntries, { ordered: false });
                                        }
                                        
                                        res.json(newG);
                                    } catch (err) {
                                        // If there's an issue with creating gradebook entries, still return the grade
                                        // but log the error for debugging
                                        console.error("Error creating gradebook entries:", err);
                                        res.json(newG);
                                    }
                                })
                        })
                        .catch(err => res.status(422).json(err));
                } else {
                    res.status(403).json(null);
                }
            })
    },

    updateGrade: function (req, res) {
        verifyKey(req.header('Authorization'), 'Admin')
            .then((isVerified) => {
                if (isVerified) {
                    let gradeDoc = req.body;
                    // Store the original grade to compare changes
                    let originalGrade;
                    
                    // First get the original grade to track changes
                    gradeDb.findById(gradeDoc._id)
                        .then(oldGradeDoc => {
                            originalGrade = oldGradeDoc;
                            
                            // Then proceed with the update
                            return gradeDb.updateMany({
                                $or: [{
                                        students: {
                                            $in: gradeDoc.students
                                        }
                                    },
                                    {
                                        teachers: {
                                            $in: gradeDoc.teachers
                                        }
                                    },
                                    {
                                        subjects: {
                                            $in: gradeDoc.subjects
                                        }
                                    },
                                ]
                            }, {
                                $pull: {
                                    students: {
                                        $in: gradeDoc.students
                                    },
                                    teachers: {
                                        $in: gradeDoc.teachers
                                    },
                                    subjects: {
                                        $in: gradeDoc.subjects
                                    }
                                }
                            });
                        })
                        .then(() => {
                            // Update class document 
                            return gradeDb.findOneAndUpdate({
                                _id: gradeDoc._id
                            }, gradeDoc, { new: true });
                        })
                        .then(async (updatedGrade) => {
                            try {
                                // Find new students (students in the updated grade that weren't in the original)
                                const newStudents = updatedGrade.students.filter(
                                    studentId => !originalGrade.students.some(id => id.toString() === studentId.toString())
                                );
                                
                                // For new students, create gradebook entries for all subjects
                                if (newStudents.length > 0) {
                                    const gradebookEntries = [];
                                    
                                    for (const studentId of newStudents) {
                                        // Get student name
                                        const studentDoc = await studentDb.findById(studentId);
                                        const studentName = `${studentDoc.first_name} ${studentDoc.last_name}`;
                                        
                                        for (const subjectId of updatedGrade.subjects) {
                                            gradebookEntries.push({
                                                subjectId: subjectId,
                                                gradeId: updatedGrade._id,
                                                studentId: studentId,
                                                studentName: studentName,
                                                grades: []
                                            });
                                        }
                                    }
                                    
                                    if (gradebookEntries.length > 0) {
                                        await gradebookDb.insertMany(gradebookEntries, { ordered: false });
                                    }
                                }
                                
                                // For existing students, check if there are new subjects and create entries
                                const existingStudents = updatedGrade.students.filter(
                                    studentId => originalGrade.students.some(id => id.toString() === studentId.toString())
                                );
                                
                                // Find new subjects (subjects in the updated grade that weren't in the original)
                                const newSubjects = updatedGrade.subjects.filter(
                                    subjectId => !originalGrade.subjects.some(id => id.toString() === subjectId.toString())
                                );
                                
                                // Create gradebook entries for existing students with new subjects
                                if (existingStudents.length > 0 && newSubjects.length > 0) {
                                    const gradebookEntries = [];
                                    
                                    for (const studentId of existingStudents) {
                                        // Get student name
                                        const studentDoc = await studentDb.findById(studentId);
                                        const studentName = `${studentDoc.first_name} ${studentDoc.last_name}`;
                                        
                                        for (const subjectId of newSubjects) {
                                            gradebookEntries.push({
                                                subjectId: subjectId,
                                                gradeId: updatedGrade._id,
                                                studentId: studentId,
                                                studentName: studentName,
                                                grades: []
                                            });
                                        }
                                    }
                                    
                                    if (gradebookEntries.length > 0) {
                                        await gradebookDb.insertMany(gradebookEntries, { ordered: false });
                                    }
                                }
                                
                                res.json(updatedGrade);
                            } catch (err) {
                                console.error("Error updating gradebook entries:", err);
                                res.json(updatedGrade);
                            }
                        })
                        .catch(err => res.status(422).json(err));
                } else {
                    res.status(403).json(null);
                }
            })
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