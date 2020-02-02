const gradeDb = require("../models/Grade");
const classDb = require("../models/Class");
const announcementDb = require("../models/Announcement");
const fileDb = require("../models/File");
const {
    createDir,
    removeDir,
    deleteFile,
    uploadFile
} = require("./NAS");

// TODO
const {
    verifyKey
} = require("./verifyController");

module.exports = {
    addAnnouncement: function (req, res) {
        verifyKey(req.header('Authorization')).then((isVerified) => {
            if (isVerified) {
                const cid = req.params.cid;
                announcementDb
                    .create(req.body)
                    .then(newA => {
                        // Add to class' announcements
                        const aid = newA._id;

                        classDb
                            .update({
                                _id: cid
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
        verifyKey(req.header('Authorization')).then((isVerified) => {
            if (isVerified) {
                const aid = req.params.aid;
                const cid = req.params.cid
                classDb
                    .update({
                        _id: cid
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
    updateAnnouncement: function (req, res) {
        verifyKey(req.header('Authorization')).then((isVerified) => {
            if (isVerified) {
                const aid = req.params.aid;
                announcementDb
                    .findOneAndUpdate({
                        _id: aid
                    }, req.body)
                    .then(newA => res.json(newA))
                    .catch(err => res.status(422).json(err));

            } else {
                res.status(403).json(null);
            }
        })

    },
    addFile: function (req, res) {
        verifyKey(req.header('Authorization'))
            .then((isVerified) => {
                if (isVerified) {

                    // Create file document
                    const path = req.body.get('path');
                    const cid = req.params.cid;
                    let fid;

                    // Upload to NAS
                    uploadFile(req, res, path)
                        .then((fileInfo) => {
                            if (fileInfo) res.json(null);

                            const fileDoc = {
                                nickname: req.body.get('name'),
                                filename: fileInfo.name,
                                path,
                                date_created: fileInfo.created
                            };

                            // Create file document
                            fileDb
                                .create(fileDoc)
                                .then(newF => {
                                    fid = newF._id;
                                    // Update class files
                                    classDb
                                        .update({
                                            _id: cid
                                        }, {
                                            $push: {
                                                files: fid
                                            }
                                        })
                                        .then((newC) => res.json(newC))
                                        .catch(err => res.status(422).json(err));

                                })
                                .catch(err => res.status(422).json(err));


                        })
                        .catch(err => res.status(500).json(err));

                } else {
                    res.status(403).json(null);
                }
            })
    },
    deleteFile: function (req, res) {
        verifyKey(req.header('Authorization'))
            .then((isVerified) => {
                if (isVerified) {
                    const fid = req.params.fid;
                    const cid = req.params.cid;

                    // Find class document and update file array
                    classDb
                        .update({
                            _id: cid
                        }, {
                            $pull: {
                                files: fid
                            }
                        })
                        .then(() => {
                            // Delete file document
                            fileDb
                                .findOneAndDelete({
                                    _id: fid
                                })
                                .then((deleted_f) => {
                                    // Delete file from NAS
                                    deleteFile(deleted_f.path)
                                        .then((result) => {
                                            if (!result) res.json(null);

                                            res.json({});
                                        })
                                        .catch(err => res.status(500).json(err));

                                })
                                .catch(err => res.status(422).json(err));

                        })
                        .catch(err => res.status(422).json(err));

                } else {
                    res.status(403).json(null);
                }
            })
    },
    updateFile: function (req, res) {
        verifyKey(req.header('Authorization'))
            .then((isVerified) => {
                if (isVerified) {
                    // update file document
                    const fid = req.params.fid;
                    const fileDoc = req.body;
                    fileDoc.last_updated = Date.now();
                    fileDb
                        .findOneAndUpdate({
                            _id: fid
                        }, fileDoc)
                        .then(newF => res.json(newF))
                        .catch(err => res.status(422).json(err));

                } else {
                    res.status(403).json(null);
                }
            })
    },
    getClass: function (req, res) {
        verifyKey(req.header('Authorization'))
            .then((isVerified) => {
                if (isVerified) {
                    classDb
                        .findOne({
                            _id: req.params.cid
                        })
                        .populate('teachers')
                        .populate('students')
                        .populate('announcements')
                        .populate('files')
                        .populate('grade')
                        .then(classDoc => res.json(classDoc))
                        .catch(err => res.status(422).json(err));

                } else {
                    res.status(403).json(null);
                }
            })
    },
    addClass: function (req, res) {
        // TODO: ADD TO GRADE DOCUMENT
        verifyKey(req.header('Authorization'))
            .then((isVerified) => {
                if (isVerified) {
                    // Create folder
                    let classDoc = req.body.document;
                    createDir(req.body.path, classDoc.name)
                        .then((path) => {
                            if (!path) res.status(500);

                            classDoc.path = path;

                            // Create class document 
                            classDb
                                .create(classDoc)
                                .then((newC) => res.json(newC))
                                .catch(err => res.status(422).json(err));

                        })

                } else {
                    res.status(403).json(null);
                }
            })
    },
    updateClass: function (req, res) {
        verifyKey(req.header('Authorization'))
            .then((isVerified) => {
                if (isVerified) {
                    const cid = req.params.cid;
                    classDb
                        .findOneAndUpdate({
                            _id: cid
                        }, req.body)
                        .then(newC => res.json(newC))
                        .catch(err => res.status(422).json(err));

                } else {
                    res.status(403).json(null);
                }
            })
    },
    deleteClass: function (req, res) {
        verifyKey(req.header('Authorization'))
            .then((isVerified) => {
                if (isVerified) {
                    const cid = req.params.cid;
                    // Delete class document
                    classDb
                    .findOneAndDelete({
                        _id: cid
                    })
                    .then((deleted_class) => {
                        gradeDb
                        .update({_id: deleted_class.grade}, { $pull: { classes: deleted_class._id } })
                        .then(() => {
                            // Delete file documents referenced by this class
                            fileDb
                            .deleteMany({ _id: { $in: deleted_class.files}})
                            .then(() => {
                                // Remove directory in which the files are held
                                removeDir(deleted_class.path)
                                    .then((result) => {
                                        if (!result) res.status(500);
    
                                        res.json({});
                                    })
                            })
                        })
                    })

                } else {
                    res.status(403).json(null);
                }
            })
    },
    addStudent: function (req, res) {
        verifyKey(req.header('Authorization'))
            .then((isVerified) => {
                if (isVerified) {
                    const sid = req.body.sid;
                    const cid = req.params.cid;

                    classDb
                        .findOneAndUpdate({
                            _id: cid
                        }, {
                            $push: {
                                students: sid
                            }
                        })
                        .then(newC => res.json(newC))
                        .catch(err => res.status(422).json(err));
                } else {
                    res.status(403).json(null);
                }
            })
    },
    deleteStudent: function (req, res) {
        verifyKey(req.header('Authorization'))
            .then((isVerified) => {
                if (isVerified) {
                    const sid = req.body.sid;
                    const cid = req.params.cid;

                    classDb
                        .findOneAndUpdate({
                            _id: cid
                        }, {
                            $pull: {
                                students: sid
                            }
                        })
                        .then(newC => res.json(newC))
                        .catch(err => res.status(422).json(err));
                } else {
                    res.status(403).json(null);
                }
            })
    },
    addTeacher: function (req, res) {
        verifyKey(req.header('Authorization'))
            .then((isVerified) => {
                if (isVerified) {
                    const tid = req.body.tid;
                    const cid = req.params.cid;

                    classDb
                        .findOneAndUpdate({
                            _id: cid
                        }, {
                            $push: {
                                teachers: tid
                            }
                        })
                        .then(newC => res.json(newC))
                        .catch(err => res.status(422).json(err));
                } else {
                    res.status(403).json(null);
                }
            })
    },
    deleteTeacher: function (req, res) {
        verifyKey(req.header('Authorization'))
            .then((isVerified) => {
                if (isVerified) {
                    const tid = req.body.tid;
                    const cid = req.params.cid;

                    classDb
                        .findOneAndUpdate({
                            _id: cid
                        }, {
                            $pull: {
                                teachers: tid
                            }
                        })
                        .then(newC => res.json(newC))
                        .catch(err => res.status(422).json(err));
                } else {
                    res.status(403).json(null);
                }
            })
    }

}