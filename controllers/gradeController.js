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
                        .then(gradeDocs => res.json(gradeDocs))
                        .catch(err => res.status(422).json(err));

                } else {
                    res.status(403).json(null);
                }
            })
    },
    // SLOW, ~4 seconds
    getUserGrade: function (req, res) {
        verifyKey(req.header('Authorization'), 'Student,Teacher,Admin')
            .then((isVerified) => {
                if (isVerified) {

                    gradeDb
                        .findOne({
                            _id: req.params.gid
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
                    createDir(NAS_PATH, `grade-${gradeDoc.level}`)
                        .then((path) => {
                            if (!path) res.status(500);

                            gradeDoc.path = path;

                            // Create class document 
                            gradeDb
                                .create(gradeDoc)
                                .then((newG) => res.json(newG))
                                .catch(err => res.status(422).json(err));

                        })

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
                        .then((deleted_grade) => {
                            let promises = [];
                            // CONCURRENT FN LAYER A
                            promises.push(removeDir(deleted_grade.path));

                            // CONCURRENT FN LAYER A: Delete Student references to these classes
                            promises.push(studentDb.update({ grade: deleted_grade._id }, {
                                grade: null
                            }))

                            // CONCURRENT FN LAYER A: Delete Student references to these classes
                            promises.push(teacherDb.update({ grade: deleted_grade._id }, {
                                grade: null
                            }))

                            Promise.all(promises)
                                .then(() => {
                                    res.json({});
                                })

                        })
                        .catch(err => res.status(422).json(err));


                } else {
                    res.status(403).json(null);
                }
            })
    },
    addStudent: function (req, res) {
        verifyKey(req.header('Authorization'), 'Admin')
            .then((isVerified) => {
                if (isVerified) {
                    const gid = req.params.gid;
                    const sid = req.params.sid;

                    gradeDb
                        .findOneAndUpdate({
                            _id: gid
                        }, {
                            $push: {
                                students: sid
                            }
                        })
                        .then(newG => res.json(newG))
                        .catch(err => res.status(422).json(err));
                } else {
                    res.status(403).json(null);
                }
            })
    },
    removeStudent: function (req, res) {
        verifyKey(req.header('Authorization'), 'Admin')
            .then((isVerified) => {
                if (isVerified) {
                    const gid = req.params.gid;
                    const sid = req.params.sid;

                    gradeDb
                        .findOneAndUpdate({
                            _id: gid
                        }, {
                            $pull: {
                                students: sid
                            }
                        })
                        .then(newG => res.json(newG))
                        .catch(err => res.status(422).json(err));
                } else {
                    res.status(403).json(null);
                }
            })
    },
    addTeacher: function (req, res) {
        verifyKey(req.header('Authorization'), 'Admin')
            .then((isVerified) => {
                if (isVerified) {
                    const gid = req.params.gid;
                    const tid = req.params.tid;

                    gradeDb
                        .findOneAndUpdate({
                            _id: gid
                        }, {
                            $push: {
                                teachers: tid
                            }
                        })
                        .then(newG => res.json(newG))
                        .catch(err => res.status(422).json(err));
                } else {
                    res.status(403).json(null);
                }
            })
    },
    removeTeacher: function (req, res) {
        verifyKey(req.header('Authorization'), 'Admin')
            .then((isVerified) => {
                if (isVerified) {
                    const gid = req.params.gid;
                    const tid = req.params.tid;

                    gradeDb
                        .findOneAndUpdate({
                            _id: gid
                        }, {
                            $pull: {
                                teachers: tid
                            }
                        })
                        .then(newG => res.json(newG))
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
                    const gid = req.params.gid;
                    const sid = req.params.sid;

                    gradeDb
                        .findOneAndUpdate({
                            _id: gid
                        }, {
                            $push: {
                                subjects: sid
                            }
                        })
                        .then(newG => res.json(newG))
                        .catch(err => res.status(422).json(err));
                } else {
                    res.status(403).json(null);
                }
            })
    },
    removeSubject: function (req, res) {
        verifyKey(req.header('Authorization'), 'Admin')
            .then((isVerified) => {
                if (isVerified) {
                    const gid = req.params.gid;
                    const sid = req.params.sid;

                    gradeDb
                        .findOneAndUpdate({
                            _id: gid
                        }, {
                            $pull: {
                                subjects: sid
                            }
                        })
                        .then(newG => res.json(newG))
                        .catch(err => res.status(422).json(err));
                } else {
                    res.status(403).json(null);
                }
            })
    },
}