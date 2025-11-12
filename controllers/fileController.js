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
        verifyKey(req.header('Authorization'), 'Admin,Teacher')
            .then((isVerified) => {
                if (!isVerified) return res.status(403).json(null);

                // 🔹 Check if a file was uploaded
                if (!req.file && !req.files) {
                    return res.status(400).json({ error: "No file uploaded" });
                }

                console.log("Starting file upload...");

                Promise.resolve(uploadFile(req, res))
                  .then((fileInfo) => {
                    console.log("Upload result:", fileInfo);
                    if (!fileInfo) {
                      return res.status(500).json({ error: "NAS upload failed or returned undefined" });
                    }

                      const fileDoc = {
                          nickname: req.body.name || fileInfo.name,
                          type: req.body.type || fileInfo.name.split('.').pop() || "unknown",
                          filename: fileInfo.name,
                          path: fileInfo.path,
                          absolutePath: fileInfo.path,
                          size: req.file ? `${req.file.size}` : "unknown",
                      };

                    return fileDb.create(fileDoc)
                      .then((newFile) => res.json(newFile))
                      .catch((err) => res.status(422).json(err));
                  })
                  .catch((err) => {
                    console.error("Upload failed:", err);
                    res.status(500).json({ error: err.message });
                  });
            });
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