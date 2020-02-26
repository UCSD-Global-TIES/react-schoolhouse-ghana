const announcementDb = require("../models/Announcement");
const subjectDb = require("../models/Subject");
const ip = require("ip")
const API_PORT = process.env.PORT || 3001;

// TODO
const {
    verifyKey
} = require("./verifyController");

module.exports = {
    // SLOW ~ 2 seconds
    getAnnouncements: function (req, res) {
        verifyKey(req.header('Authorization'), 'Student,Teacher,Admin')
            .then((isVerified) => {
                if (isVerified) {
                    let query;

                    if (req.query.private === "false") query = {
                        private: false
                    }

                    announcementDb
                        .find(query)
                        .populate('files')
                        .then((announcements) => {

                            for (let i = 0; i < announcements.length; i++) {
                                const annFilesWithPaths = [];
                                let currentAnnouncement = announcements[i];
                                for (const file of currentAnnouncement.files) {
                                    let newFile = { ...file }

                                    newFile = newFile._doc
                                    newFile.path = `http://${ip.address()}:${API_PORT}${file.path}`;
                                    annFilesWithPaths.push(newFile);
                                }
                                currentAnnouncement.files = annFilesWithPaths;
                            }

                            res.json(announcements);
                        })
                        .catch(err => res.status(422).json(err));
                } else {
                    res.status(403).json(null);
                }
            })
    },
    addAnnouncement: function (req, res) {
        verifyKey(req.header('Authorization'), 'Admin')
            .then((isVerified) => {
                if (isVerified) {
                    announcementDb
                        .create(req.body)
                        .then(newA => {
                            res.json(newA);
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

                announcementDb
                    .findOne({
                        _id: aid
                    })
                    .then(doc => {
                        doc.remove();

                        if (doc.subject) {
                            subjectDb
                                .update({
                                    _id: doc.subject
                                }, {
                                    $pull: {
                                        announcements: doc._id
                                    }
                                })
                                .then(() => {
                                    res.json({});
                                })
                                .catch(err => res.status(422).json(err));
                        } else {
                            res.json({});
                        }
                    })
                    .catch(err => res.status(422).json(err));

            } else {
                res.status(403).json(null);
            }
        })

    },
    updateAnnouncement: function (req, res) {
        verifyKey(req.header('Authorization'), 'Teacher,Admin').then((isVerified) => {
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

    }
}