const gradeDb = require("../models/Grade");
const studentDb = require("../models/Student");
const teacherDb = require("../models/Teacher");

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
        verifyKey(req.header('Authorization'), 'admin')
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
    getGrade: function (req, res) {
        verifyKey(req.header('Authorization'), 'admin')
            .then((isVerified) => {
                if (isVerified) {
                    gradeDb
                        .findOne({
                            _id: req.params.gid
                        })
                        .populate('classes')
                        .then(gradeDoc => res.json(gradeDoc))
                        .catch(err => res.status(422).json(err));

                } else {
                    res.status(403).json(null);
                }
            })
    },
    addGrade: function (req, res) {
        verifyKey(req.header('Authorization'), 'admin')
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
                    res.status(403).json(null);
                }
            })
    },
    // updateGrade: function (req, res) {
    //     verifyKey(req.header('Authorization'))
    //         .then((isVerified) => {
    //             if (isVerified) {
    //                 const gid = req.params.gid;
    //                 gradeDb
    //                     .findOneAndUpdate({
    //                         _id: gid
    //                     }, req.body)
    //                     .then(newG => res.json(newG))
    //                     .catch(err => res.status(422).json(err));

    //             } else {
    //                 res.status(403).json(null);
    //             }
    //         })
    // },
    deleteGrade: function (req, res) {
        verifyKey(req.header('Authorization'), 'admin')
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
                            promises.push(studentDb.update({}, {
                                $pull: {
                                    classes: {
                                        $in: deleted_grade.classes
                                    }
                                }
                            }))

                            // CONCURRENT FN LAYER A: Delete Student references to these classes
                            promises.push(teacherDb.update({}, {
                                $pull: {
                                    classes: {
                                        $in: deleted_grade.classes
                                    }
                                }
                            }))

                            // CONCURRENT FN LAYER A: Find Class documents
                            promises.push(classDb.find({
                                _id: {
                                    $in: deleted_grade.classes
                                }
                            }));

                            Promise.all(promises)
                                .then((results) => {
                                    let fileIDs = [];
                                    for (let classDoc of results[3]) {
                                        fileIDs.push(classDoc.files);
                                    }
                                    // CONCURRENT FN LAYER B: Delete files

                                    fileDb.deleteMany({
                                            _id: {
                                                $in: fileIDs
                                            }
                                        })
                                        .then(() => {
                                            res.json({});
                                        })

                                })


                        })
                        .catch(err => res.status(422).json(err));


                } else {
                    res.status(403).json(null);
                }
            })
    }
}