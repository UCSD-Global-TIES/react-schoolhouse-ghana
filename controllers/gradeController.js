const gradeDb = require("../models/Grade");
const studentDb = require("../models/Student");
const teacherDb = require("../models/Teacher");

const {
    createDir,
    removeDir,
    NAS_PATH
} = require("./NAS");

const {
    verifyKey
} = require("./verifyController");
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
                            $or: [
                                {
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

                        .then(gradeDoc => res.json(gradeDoc))
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
                    gradeDb.updateMany(
                        {
                            $or: [
                                {
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
                        },
                        {
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
                                .then((newG) =>
                                    res.json(newG)
                                )
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
                    // Create folder
                    let gradeDoc = req.body;

                    // Find all grades whose field 'students'/'teachers'/'subjects' has an identical _id in newG's corresponding fields and pull that _id the respective field 
                    gradeDb.updateMany(
                        {
                            $or: [
                                {
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
                        },
                        {
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
                                .findOneAndUpdate({ _id: gradeDoc._id }, gradeDoc)
                                .then((newG) =>
                                    res.json(newG)
                                )
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