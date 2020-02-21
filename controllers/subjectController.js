const gradeDb = require("../models/Grade");
const subjectDb = require("../models/Subject");
const announcementDb = require("../models/Announcement");
const {
    createDir,
    removeDir
} = require("./NAS");

const {
    verifyKey
} = require("./verifyController");

module.exports = {
    addAnnouncement: function (req, res) {
        verifyKey(req.header('Authorization'), 'Teacher,Admin').then((isVerified) => {
            if (isVerified) {
                const sid = req.params.sid;
                announcementDb
                    .create(req.body)
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
                    })
                    .catch(err => res.status(422).json(err));
            } else {
                res.status(403).json(null);
            }
        })

    },
    deleteAnnouncement: function (req, res) {
        verifyKey(req.header('Authorization'), 'Teacher,Admin').then((isVerified) => {
            if (isVerified) {
                const aid = req.params.aid;
                const sid = req.params.sid
                subjectDb
                    .update({
                        _id: sid
                    }, {
                        $pull: {
                            announcements: aid
                        }
                    })
                    .then(() => {
                        announcementDb
                            .findOne({
                                _id: aid
                            })
                            .then(doc => {

                                doc.remove();
                                res.json({});
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
                    const sid = req.params.sid;
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
                    const sid = req.params.sid;
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
    getSubject: function (req, res) {
        verifyKey(req.header('Authorization'), 'Student,Teacher,Admin')
            .then((isVerified) => {
                if (isVerified) {
                    subjectDb
                        .findOne({
                            _id: req.params.sid
                        })
                        .populate({
                            path: 'announcements',
                            populate: {
                                path: 'files'
                            }
                        })
                        .populate('files')
                        .populate('grade')
                        .then(subjectDoc => res.json(subjectDoc))
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
                    // Create folder
                    let subjectDoc = req.body.document;
                    // Create subject document 
                    subjectDb
                        .create(subjectDoc)
                        .then((newS) => {
                            if (newS.grade) {
                                gradeDb
                                    .updateOne({
                                        _id: newS.grade
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
        verifyKey(req.header('Authorization'), 'Admin')
            .then((isVerified) => {
                if (isVerified) {
                    const sid = req.params.sid;
                    subjectDb
                        .findOneAndUpdate({
                            _id: sid
                        }, req.body)
                        .then(newS => res.json(newS))
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
                    const sid = req.params.sid;
                    // Delete subject document
                    subjectDb
                        .findOneAndDelete({
                            _id: sid
                        })
                        .then((deleted_subject) => {
                            gradeDb
                                .update({
                                    _id: deleted_subject.grade
                                }, {
                                    $pull: {
                                        subjects: deleted_subject._id
                                    }
                                })
                                .then(() => {
                                    res.json({});
                                })
                        })

                } else {
                    res.status(403).json(null);
                }
            })
    },

}