const gradeDb = require("../models/Grade");
const {
    createDir,
    removeDir,
    NAS_PATH
} = require("./NAS");

// TODO
const {
    verifyKey
} = require("./verifyController");
module.exports = {
    getGrades: function (req, res) {
        verifyKey(req.header('Authorization'))
            .then((isVerified) => {
                if (isVerified) {
                    gradeDb
                        .find({})
                        .then(gradeDocs => res.json(gradeDocs))
                        .catch(err => res.status(422).json(err));

                } else {
                    res.status(403);
                }
            })
    },
    getGrade: function (req, res) {
        verifyKey(req.header('Authorization'))
            .then((isVerified) => {
                if (isVerified) {
                    gradeDb
                        .findOne({
                            _id: req.params.gid
                        })
                        .then(gradeDoc => res.json(gradeDoc))
                        .catch(err => res.status(422).json(err));

                } else {
                    res.status(403);
                }
            })
    },
    addGrade: function (req, res) {
        verifyKey(req.header('Authorization'))
            .then((isVerified) => {
                if (isVerified) {
                    // Create folder
                    let gradeDoc = req.body;
                    createDir(NAS_PATH, gradeDoc.name)
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
                    res.status(403);
                }
            })
    },
    updateGrade: function (req, res) {
        verifyKey(req.header('Authorization'))
            .then((isVerified) => {
                if (isVerified) {
                    const gid = req.params.gid;
                    gradeDb
                        .findOneAndUpdate({
                            _id: gid
                        }, req.body)
                        .then(newG => res.json(newG))
                        .catch(err => res.status(422).json(err));

                } else {
                    res.status(403);
                }
            })
    },
    deleteGrade: function (req, res) {
        // TODO - NEED TO RECURSIVELY DELETE ALL ASSOCIATED CLASSES, FILES, AND ACCOUNT REFERENCES TO THOSE CLASSES
        verifyKey(req.header('Authorization'))
            .then((isVerified) => {
                if (isVerified) {
                    const gid = req.params.gid;

                    gradeDb
                        .findOneAndDelete({
                            _id: gid
                        })
                        .then((deleted_graph) => {
                            removeDir(deleted_graph.path)
                                .then((result) => {
                                    if (!result) res.status(500);

                                    res.json({});
                                })
                        })
                        .catch(err => res.status(422).json(err));


                } else {
                    res.status(403);
                }
            })
    }
}