const gradeDb = require("../models/Grade");
const subjectDb = require("../models/Subject");
const announcementDb = require("../models/Announcement");
const ip = require("ip")
const API_PORT = process.env.PORT || 3001;

const {
    verifyKey
} = require("./verifyController");
const { processAnnouncements } = require("./processAnnouncements");

module.exports = {
    addAnnouncement: function (req, res) {
        verifyKey(req.header('Authorization'), 'Teacher,Admin')
            .then((isVerified) => {
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
    getSubjects: function (req, res) {
        verifyKey(req.header('Authorization'), 'Admin')
            .then((isVerified) => {
                if (isVerified) {
                    subjectDb
                        .find({})
                        .populate('announcements')
                        .then(subjectDoc => res.json(subjectDoc))
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
        verifyKey(req.header('Authorization'), 'Teacher,Admin')
            .then((isVerified) => {
                if (isVerified) {
                    announcementDb
                        .find({ subject: req.params.sid })
                        .then(subjectAnns => res.json(subjectAnns))
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
                    const sid = req.params.sid;
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
                    const sid = req.params.sid;
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

}