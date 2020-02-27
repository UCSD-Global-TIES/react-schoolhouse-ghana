const fileDb = require("../models/File");
const subjectDb = require("../models/Subject");
const announcementDb = require("../models/Announcement");
const ip = require("ip");
const API_PORT = process.env.PORT || 3001;
const {
    deleteFile,
    uploadFile
} = require("./NAS");

const {
    verifyKey
} = require("./verifyController");

module.exports = {
    getFiles: function (req, res) {
        verifyKey(req.header('Authorization'), 'Teacher,Admin')
            .then((isVerified) => {
                if (isVerified) {

                    fileDb
                        .find({})
                        .then((files) => {
                            const filesWithPaths = [];
                            for (let file of files) {
                                file.path = `http://${ip.address()}:${API_PORT}${file.path}`;
                                filesWithPaths.push(file);
                            }

                            res.json(filesWithPaths)
                        })

                } else {
                    res.status(403).json(null);
                }
            })
    },
    createFile: function (req, res) {
        verifyKey(req.header('Authorization'), 'Admin')
            .then((isVerified) => {
                if (isVerified) {

                    //Create file document
                    const path = req.body.get('path');

                    // Upload to NAS
                    uploadFile(req, res, path)
                        .then((fileInfo) => {
                            if (fileInfo) res.json(null);

                            const fileDoc = {
                                nickname: req.body.get('name'),
                                filename: fileInfo.name,
                                type: req.body.get('type'),
                                path: fileInfo.path,
                                date_created: fileInfo.created
                            };

                            // Create file document
                            fileDb
                                .create(fileDoc)
                                .then(newF => {
                                    res.json(newF)
                                })
                                .catch(err => res.status(422).json(err));


                        })
                        .catch(err => res.status(500).json(err));

                } else {
                    res.status(403).json(null);
                }
            })
    },
    getFile: function (req, res) {
        verifyKey(req.header('Authorization'), 'Student,Teacher,Admin')
            .then((isVerified) => {
                if (isVerified) {
                    const fid = req.params.fid;
                    fileDb
                        .findOne({ _id: fid })
                        .then((file) => {
                            // Return path of file on NAS
                            file.path = `http://${ip.address()}:${API_PORT}${file.path}`

                            res.json(file)
                        })

                } else {
                    res.status(403).json(null);
                }
            })
    },
    deleteFile: function (req, res) {
        verifyKey(req.header('Authorization'), 'Admin')
            .then((isVerified) => {
                if (isVerified) {

                    const fid = req.params.fid;
                    fileDb
                        .findOne({ _id: fid })
                        .then((fileObj) => {
                            // Delete file from NAS
                            deleteFile(fileObj.absolutePath)
                                .then((result) => {
                                    if (!result) {
                                        res.json(null);
                                        return;
                                    };

                                    fileDb.deleteOne({ _id: fid })
                                        .then(() => {
                                            const promises = [];

                                            promises.push(subjectDb.updateMany(
                                                {
                                                    files: {
                                                        $elemMatch: {
                                                            $eq: fid
                                                        }
                                                    }
                                                },
                                                {
                                                    $pull: {
                                                        files: fid
                                                    }
                                                }))

                                            promises.push(announcementDb.updateMany(
                                                {
                                                    files: {
                                                        $elemMatch: {
                                                            $eq: fid
                                                        }
                                                    }
                                                },
                                                {
                                                    $pull: {
                                                        files: fid
                                                    }
                                                }))

                                            Promise.all(promises)
                                                .then(() => res.json({}))
                                        })
                                })
                                .catch(err => res.status(500).json(err));
                        })

                } else {
                    res.status(403).json(null);
                }
            })
    },
    updateFile: function (req, res) {
        verifyKey(req.header('Authorization'), 'Admin')
            .then((isVerified) => {
                if (isVerified) {

                    const fid = req.params.fid;
                    const { nickname } = req.body;
                    // Don't update path with dynamic path
                    fileDb
                        .updateOne({ _id: fid }, { nickname })
                        .then((newF) => {
                            res.json(newF)
                        })

                } else {
                    res.status(403).json(null);
                }
            })
    }
}