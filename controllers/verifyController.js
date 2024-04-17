const accountDb = require("../models/Account");
const gradeDb = require("../models/Grade");
const subjectDb = require("../models/Subject");
const fileDb = require("../models/File");
const announcementDb = require("../models/Announcement");
const config = require("../nasConfig");
const path = require("path");
const fs = require("fs")
const adminDb = require("../models/Admin");
const loadtest = require('loadtest');
const gradeSeeds = require('../seeds/grades')
const subjectSeeds = require('../seeds/subjects');
const fileSeeds = require('../seeds/files');
const { announcements: announcementSeeds } = require('../seeds/announcements');

const {
    encryptPassword,
    verifyPassword
} = require("../scripts/encrypt");

module.exports = {
    // https://stackoverflow.com/questions/44072750/how-to-send-basic-auth-with-axios
    verifyAccount: function (req, res) {
        // Find account document with matching username
        const {
            username,
            password
        } = JSON.parse(req.header('Authorization'));
        accountDb
            .findOne({
                username
            })
            .populate('profile')
            .then((account) => {
                // If an account with the provided username is found
                if (account) {
                    // If passwords match, return populated document
                    if (verifyPassword(password, account.password)) {
                        // Set session user cookie (in login)
                        req.session.user = {
                            type: account.type,
                            profile: account.profile,
                            key: account._id
                        };

                        // API KEY SHOULD NOT BE ACCOUNT _id (future feature)
                        res.json({
                            type: account.type,
                            profile: account.profile,
                            key: account._id
                        });


                    } else {
                        res.json(null);
                    }
                }
                // If an account with the provided username is NOT found
                else {
                    res.json(null)
                }

            })
    }, // ~ 100 ms

    verifySession: function (req, res) {
        if (!req.session || !req.cookies) res.json(null);
        else if (req.session.user && req.cookies.user_sid) res.json(req.session.user);
        else res.json(null);
    }, // ~ 0.5 - 1.5 ms
    destroySession: function (req, res) {
        if (req.session.user && req.cookies.user_sid) {
            res.clearCookie('user_sid');
        }
        res.json(null);
    }, // ~ 0.5 ms
    verifyKey: function (key, access_type) {
        const types = access_type.split(",");

        return new Promise((resolve, reject) => {
            // API KEY SHOULD NOT BE ACCOUNT _id (future feature)
            accountDb
                .findOne({
                    _id: key
                })
                .then((account) => {
                    if (account) {
                        resolve(types.includes(account.type));
                    } else resolve(undefined)
                })
        })
    },
    verifyInitialization: function (req, res) {
        const rootAccount = {
            first_name: "SAS",
            last_name: "Admin",
            username: "root",
            password: "admin"
        }

        // Before starting the server, check to see an admin user exists; if not, create one
        accountDb
            .find({ type: "Admin" })
            .then((accounts) => {

                if (!accounts.length) {
                    adminDb
                        .create({
                            first_name: rootAccount.first_name,
                            last_name: rootAccount.last_name
                        })
                        .then((newAdmin) => {
                            accountDb
                                .create({
                                    username: rootAccount.username,
                                    password: encryptPassword(rootAccount.password),
                                    profile: newAdmin._id,
                                    type: 'Admin'
                                })
                                .then(() => {
                                    res.json({ username: rootAccount.username, password: rootAccount.password })
                                })

                        })
                }
                else {
                    res.json(null)

                }
            }
            )
    },
    seedDefault: function (req, res) {
        // Seed the database with example documents
        const filePath = `${config.path}/${fileSeeds.filename}`
        fs.writeFile(filePath, 'Hello World!', 'utf8',
            (err) => {
                if (err) throw err;

                const { size } = fs.statSync(filePath);
                const { nickname, type, filename } = fileSeeds;
                const fileObj = {
                    nickname, type, filename, path: `${config.publicPath !== "/" ? config.publicPath : ""}/${filename}`, absolutePath: filePath, size
                }

                // 1
                fileDb
                    .create(fileObj)
                    .then((newF) => {
                        let annDocs = announcementSeeds;
                        for (let annDoc of annDocs) {
                            annDoc.files = [newF._id];
                        }

                        // 2
                        announcementDb
                            .create(annDocs)
                            .then((newDocs) => {
                                let subjectDoc = subjectSeeds;
                                let privateAnn;
                                for (let newDoc of newDocs) {
                                    if (newDoc.private) {
                                        subjectDoc.announcements = [newDoc._id];
                                        privateAnn = newDoc;
                                    }
                                }
                                subjectDoc.files = [newF._id];

                                // 3
                                subjectDb
                                    .create(subjectDoc)
                                    .then((newS) => {
                                        let gradeDoc = gradeSeeds;
                                        gradeDoc.subjects = [newS._id];

                                        const promises = [];
                                        promises.push(gradeDb.create(gradeDoc));

                                        privateAnn.subject = newS._id
                                        promises.push(announcementDb.findOneAndUpdate({ _id: privateAnn._id }, privateAnn))

                                        Promise.all(promises)
                                            .then(() => {
                                                res.json({});

                                            })

                                    })


                            })

                    })

            }

        );



    },
    verifyLatency: function (req, res) {
        const options = {
            url: 'http://localhost:3000',
            maxRequests: 1000,
        };
        loadtest.loadTest(options, function (error, result) {
            if (error) {
                res.json(null);
                return;
            }
            const { meanLatencyMs: mean, maxLatencyMs: max, minLatencyMs: min } = result;
            res.json({ mean, min, max });
        });
    }

}