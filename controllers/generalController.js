const announcementDb = require("../models/Announcement");

// TODO
const {
    verifyKey
} = require("./verifyController");

module.exports = {
    // SLOW ~ 2 seconds
    getAnnouncements: function (req, res) {
        verifyKey(req.header('Authorization'), 'Admin')
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
        verifyKey(req.header('Authorization'), 'Admin').then((isVerified) => {
            if (isVerified) {
                const aid = req.params.aid;

                announcementDb
                    .findOne({
                        _id: aid
                    })
                    .then(doc => {
                        doc.remove();
                        res.json({});
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