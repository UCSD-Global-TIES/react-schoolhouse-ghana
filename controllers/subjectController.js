const gradeDb = require("../models/Grade");
const subjectDb = require("../models/Subject");
const announcementDb = require("../models/Announcement");
const studentDb = require("../models/Student");
const accountDb = require("../models/Account");
const taskController = require('./taskController');

const ip = require("ip")
const API_PORT = process.env.PORT || 3001;

const {
    verifyKey
} = require("./verifyController");
const { processAnnouncements } = require("./processAnnouncements");

module.exports = {
    addMarksForStudent: function (req, res) {
        verifyKey(req.header("Authorization"), "Teacher,Admin").then((isVerified) => {
          if (isVerified) {
            const studentId = req.params.studentId;
            const marks = req.body.marks;
    
            // Assuming the studentId is valid, you can find the student and update their marks
            studentDb
              .findOneAndUpdate(
                { _id: studentId },
                { $push: { marks: { $each: marks } } }, // Add multiple marks to the array
                { new: true } // Return the updated student object
              )
              .then((updatedStudent) => {
                if (updatedStudent) {
                  res.json(updatedStudent);
                } else {
                  res.status(404).json({ error: "Student not found." });
                }
              })
              .catch((err) => res.status(422).json(err));
          } else {
            res.status(403).json(null);
          }
        })
    },
    addAnnouncement: function (req, res) {
        const userKey = req.header('Authorization');
        verifyKey(userKey, 'Teacher,Admin')
            .then((isVerified) => {
                if (isVerified) {
                    const sid = req.params.subjectId;
                    
                    // Get user info to add as author
                    accountDb.findOne({ _id: userKey })
                        .populate('profile')
                        .then((account) => {
                            if (!account) {
                                return res.status(403).json({ error: 'User not found' });
                            }

                            // Add author information to the request body
                            const announcementData = {
                                ...req.body,
                                authorId: account._id,
                                authorRole: account.type,
                                authorName: account.type === 'Admin' 
                                    ? `${account.profile.first_name} ${account.profile.last_name}`
                                    : `${account.profile.first_name} ${account.profile.last_name}`,
                                subject: sid  // Ensure subject-specific announcements are linked to the subject
                            };

                            announcementDb
                                .create(announcementData)
                                .then(newA => {
                                    // Add to subject' announcements
                                    const aid = newA._id;

                                    subjectDb
                                        .update({
                                            _id: sid
                                        }, {
                                            $push: {
                                                announcements: aid
                                            }
                                        })
                                        .then(() => {
                                            res.json(newA);
                                        })
                                        .catch(err => res.status(422).json(err));
                                })
                                .catch(err => res.status(422).json(err));
                        })
                        .catch(err => res.status(422).json(err));
                } else {
                    res.status(403).json(null);
                }
            })

    },
    deleteAnnouncement: function (req, res) {
        const userKey = req.header('Authorization');
        verifyKey(userKey, 'Teacher,Admin').then((isVerified) => {
            if (isVerified) {
                const aid = req.params.aid;
                const sid = req.params.subjectId;

                // First, get the current user's information
                accountDb.findOne({ _id: userKey })
                    .then((currentUser) => {
                        if (!currentUser) {
                            return res.status(403).json({ error: 'User not found' });
                        }

                        // Get the announcement to check ownership
                        announcementDb.findOne({ _id: aid })
                            .then((announcement) => {
                                if (!announcement) {
                                    return res.status(404).json({ error: 'Announcement not found' });
                                }

                                // Permission check: Admins can delete any announcement, Teachers can only delete their own
                                const canDelete = currentUser.type === 'Admin' || 
                                    (currentUser.type === 'Teacher' && announcement.authorId.toString() === currentUser._id.toString());

                                if (!canDelete) {
                                    return res.status(403).json({ error: 'You do not have permission to delete this announcement' });
                                }

                                // Proceed with deletion
                                subjectDb
                                    .update({
                                        _id: sid
                                    }, {
                                        $pull: {
                                            announcements: aid
                                        }
                                    })
                                    .then(() => {
                                        announcement.remove();
                                        res.json({});
                                    })
                                    .catch(err => res.status(422).json(err));
                            })
                            .catch(err => res.status(422).json(err));
                    })
                    .catch(err => res.status(422).json(err));

            } else {
                res.status(403).json(null);
            }
        })

    },
    addFile: function (req, res) {
        verifyKey(req.header('Authorization'), 'Teacher,Admin')
            .then((isVerified) => {
                if (isVerified) {
                    const sid = req.params.subjectId;
                    const fid = req.params.fid;

                    subjectDb
                        .updateOne({ _id: sid }, {
                            $push: {
                                files: fid
                            }
                        })
                        .then(() => res.json({}))
                        .catch(err => res.status(422).json(err));


                } else {
                    res.status(403).json(null);
                }
            })
    },
    removeFile: function (req, res) {
        verifyKey(req.header('Authorization'), 'Teacher,Admin')
            .then((isVerified) => {
                if (isVerified) {
                    const sid = req.params.subjectId;
                    const fid = req.params.fid;

                    subjectDb
                        .updateOne({ _id: sid }, {
                            $pull: {
                                files: fid
                            }
                        })
                        .then(() => res.json({}))
                        .catch(err => res.status(422).json(err));


                } else {
                    res.status(403).json(null);
                }
            })
    },
    getSubjects: function (req, res) {
        // Allow Admin, Teacher and Student to fetch subjects, but scope Teacher/Student to their grades
        const key = req.header('Authorization');
        verifyKey(key, 'Admin,Teacher,Student')
            .then((isVerified) => {
                if (!isVerified) return res.status(403).json(null);

                // Load the account so we can inspect its type/profile
                accountDb.findOne({ _id: key }).then(account => {
                    if (!account) return res.status(403).json(null);

                    // Admin: return all subjects
                    if (account.type === 'Admin') {
                        subjectDb.find({})
                            .populate('announcements')
                            .then(subjectDoc => res.json(subjectDoc))
                            .catch(err => res.status(422).json(err));
                        return;
                    }

                    // For Teacher or Student: find grades that include the teacher/student
                    const profileId = account.profile;
                    const query = account.type === 'Teacher' ? { teachers: profileId } : { students: profileId };

                    gradeDb.find(query)
                        .then(grades => {
                            // Collect unique subject ids from grades
                            const subjectIdSet = new Set();
                            for (const g of grades) {
                                if (g.subjects && g.subjects.length) {
                                    for (const sid of g.subjects) subjectIdSet.add(String(sid));
                                }
                            }

                            const subjectIds = Array.from(subjectIdSet);
                            if (!subjectIds.length) return res.json([]);

                            // Fetch subjects and populate announcements
                            subjectDb.find({ _id: { $in: subjectIds } })
                                .populate('announcements')
                                .then(subjectDocs => res.json(subjectDocs))
                                .catch(err => res.status(422).json(err));
                        })
                        .catch(err => res.status(422).json(err));

                }).catch(err => res.status(422).json(err));

            })
    },
    getSubject: function (req, res) {
        // console.log("getSubject params:", req.params);
        verifyKey(req.header('Authorization'), 'Student,Teacher,Admin')
            .then((isVerified) => {
                if (isVerified) {
                    subjectDb
                        .findOne({
                            _id: req.params.subjectId
                        })
                        .populate({
                            path: 'announcements',
                            populate: {
                                path: 'files'
                            }
                        })
                        .populate('files')
                        .populate('grade')
                        .then(subjectDoc => {
                            let popSubject = { ...subjectDoc };
                            popSubject = popSubject._doc;
                            // Replace files with absolute paths based on new IP address
                            const filesWithPaths = [];
                            for (let file of popSubject.files) {
                                let newFile = { ...file };
                                newFile = newFile._doc;
                                newFile.path = `http://${ip.address()}:${API_PORT}${file.path}`;
                                filesWithPaths.push(newFile);
                            }

                            popSubject.files = filesWithPaths

                            popSubject.announcements = processAnnouncements(popSubject.announcements)

                            res.json(popSubject)
                        })
                        .catch(err => res.status(422).json(err));

                } else {
                    res.status(403).json(null);
                }
            })
    },

    getAnnouncements: function (req, res) {
        const userKey = req.header('Authorization');
        verifyKey(userKey, 'Student,Teacher,Admin')
            .then((isVerified) => {
                if (isVerified) {
                    const subjectId = req.params.subjectId;
                    
                    // Get current user info for enrollment checking
                    accountDb.findOne({ _id: userKey })
                        .populate('profile')
                        .then((currentUser) => {
                            if (!currentUser) {
                                return res.status(403).json({ error: 'User not found' });
                            }

                            // Check if user has access to this subject
                            if (currentUser.type === 'Student') {
                                // For students, check if they're enrolled in a grade that includes this subject
                                gradeDb.findOne({ 
                                    students: currentUser.profile._id,
                                    subjects: subjectId 
                                })
                                .then((enrollment) => {
                                    if (!enrollment) {
                                        // Student not enrolled in this subject
                                        return res.status(403).json({ error: 'You are not enrolled in this subject' });
                                    }

                                    // Student is enrolled, get subject announcements
                                    announcementDb
                                        .find({ subject: subjectId })
                                        .then(subjectAnns => res.json(subjectAnns))
                                        .catch(err => res.status(422).json(err));
                                })
                                .catch(err => res.status(422).json(err));
                            } else if (currentUser.type === 'Teacher') {
                                // For teachers, check if they teach this subject (are in a grade with this subject)
                                gradeDb.findOne({ 
                                    teachers: currentUser.profile._id,
                                    subjects: subjectId 
                                })
                                .then((teaching) => {
                                    if (!teaching) {
                                        // Teacher doesn't teach this subject
                                        return res.status(403).json({ error: 'You do not teach this subject' });
                                    }

                                    // Teacher teaches this subject, get all announcements
                                    announcementDb
                                        .find({ subject: subjectId })
                                        .then(subjectAnns => res.json(subjectAnns))
                                        .catch(err => res.status(422).json(err));
                                })
                                .catch(err => res.status(422).json(err));
                            } else {
                                // Admin can see all subject announcements
                                announcementDb
                                    .find({ subject: subjectId })
                                    .then(subjectAnns => res.json(subjectAnns))
                                    .catch(err => res.status(422).json(err));
                            }
                        })
                        .catch(err => res.status(422).json(err));
                } else {
                    res.status(403).json(null);
                }
            })
    },
    addSubject: function (req, res) {
        verifyKey(req.header('Authorization'), 'Admin')
            .then((isVerified) => {
                if (isVerified) {
                    let subjectDoc = req.body;
                    const gradeID = subjectDoc.grade;
                    subjectDoc.grade = null;

                    // Create subject document 
                    subjectDb
                        .create(subjectDoc)
                        .then((newS) => {
                            if (gradeID) {
                                gradeDb
                                    .updateOne({
                                        _id: gradeID
                                    }, {
                                        $push: {
                                            subjects: newS._id
                                        }
                                    })
                                    .then(() => {
                                        res.json(newS)
                                    })
                            } else {
                                res.json(newS)
                            }
                        })
                        .catch(err => res.status(422).json(err));

                } else {
                    res.status(403).json(null);
                }
            })
    },
    updateSubject: function (req, res) {
        verifyKey(req.header('Authorization'), 'Teacher,Admin')
            .then((isVerified) => {
                if (isVerified) {
                    const sid = req.params.subjectId;
                    let subjectDoc = req.body;
                    const gradeID = subjectDoc.grade;
                    subjectDoc.grade = null;

                    subjectDb
                        .findOneAndUpdate({
                            _id: sid
                        }, subjectDoc)
                        .then(newS => {
                            // If the subject is assigned a grade, remove reference to subject from all other grades
                            if (gradeID) {

                                // Find all grades whose field 'students'/'teachers'/'subjects' has an identical _id in newG's corresponding fields and pull that _id the respective field 
                                gradeDb.updateMany(
                                    {
                                        subjects: {
                                            $elemMatch: {
                                                $eq: newS._id
                                            }
                                        }
                                    },
                                    {
                                        $pull: {
                                            subjects: newS._id
                                        }
                                    }

                                ).then(() => {

                                    gradeDb
                                        .updateOne({
                                            _id: gradeID
                                        }, {
                                            $push: {
                                                subjects: newS._id
                                            }
                                        })
                                        .then(() => {
                                            res.json(newS)
                                        })

                                })
                            }
                            else {
                                res.json(newS)
                            }

                        })
                        .catch(err => res.status(422).json(err));

                } else {
                    res.status(403).json(null);
                }
            })
    },
    deleteSubject: function (req, res) {
        verifyKey(req.header('Authorization'), 'Admin')
            .then((isVerified) => {
                if (isVerified) {
                    const sid = req.params.subjectId;
                    // Delete subject document
                    subjectDb
                        .findOneAndDelete({
                            _id: sid
                        })
                        .then((deleted_subject) => {
                            // If the subject is assigned a grade, remove reference to subject from all other grades

                            // Find all grades whose field 'students'/'teachers'/'subjects' has an identical _id in newG's corresponding fields and pull that _id the respective field 
                            gradeDb.updateMany(
                                {},
                                {
                                    $pull: {
                                        subjects: deleted_subject._id
                                    }
                                }

                            ).then(() => {
                                announcementDb.deleteMany({ subject: deleted_subject._id })
                                    .then(() => res.json({}))
                            })
                        })

                } else {
                    res.status(403).json(null);
                }
            })
    },
    getTasksForSubject: function (req, res) {
        verifyKey(req.header('Authorization'), 'Teacher,Admin')
            .then((isVerified) => {
                if (isVerified) {
                    taskController.getTasks(req, res);
                } else {
                    res.status(403).json(null);
                }
            })
    },

}