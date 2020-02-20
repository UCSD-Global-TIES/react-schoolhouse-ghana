const accountDb = require("../models/Account");
const announcementDb = require("../models/Account");
const StudentDb = require("../models/Student");
const TeacherDb = require("../models/Teacher");
const AdminDb = require("../models/Admin");
const classDb = require("../models/Admin");

// TODO
const {
    verifyKey
} = require("./verifyController");

const {
    generatePassword,
    encryptPassword,
    verifyPassword
} = require("../scripts/encrypt");

const PASSWORD_LENGTH = 6;
const PASSWORD_NUMBERS = true;
const PASSWORD_SYMBOLS = false;

const generateUniqueUsername = (first_name, last_name) => {
    const MAX_LASTNAME_LENGTH = 3;
    const NUM_TAG_LENGTH = 3;

    const generateTag = (length) => {
        let tag = "";

        for (let i = 0; i < length; i++) {
            const numStr = (Math.floor(Math.random() * 10)).toString();
            tag.concat(numStr);
        }

    }

    const generateUsername = (first_name, last_name) => {
        let lastNameLength = 0;
        if (last_name.length < MAX_LASTNAME_LENGTH) {
            lastNameLength = last_name.length;
        } else {
            lastNameLength = last_name.substr(0, MAX_LASTNAME_LENGTH);
        }

        return first_name.charAt(0) + last_name.substr(0, lastNameLength) + generateTag(NUM_TAG_LENGTH);

    }

    const proposedName = generateUsername(first_name, last_name);

    return accountDb
        .findOne({
            username: proposedName
        })
        .then(function (account) {
            if (account) {
                return generateUniqueUsername(first_name, last_name);
            }

            return proposedName;
        })
        .catch(function (err) {
            throw err;
        });
}

module.exports = {
    addAccount: function (req, res) {
        verifyKey(req.header('Authorization'), 'Admin')
            .then((isVerified) => {
                if (isVerified) {
                    // Client provides first_name, last_name, type, Grade _id (if Student)
                    // Server generates username, password

                    const type = req.body.type;
                    let doc;
                    let db;
                    switch (type) {
                        case "Student":
                            doc = {
                                first_name: req.body.first_name,
                                last_name: req.body.last_name,
                                grade: req.body.grade
                            }
                            db = StudentDb;
                            break;
                        case "Teacher":
                            doc = {
                                first_name: req.body.first_name,
                                last_name: req.body.last_name,
                            }
                            db = TeacherDb;
                            break;
                        case "Admin":
                            doc = {
                                first_name: req.body.first_name,
                                last_name: req.body.last_name,
                            }
                            db = AdminDb;
                            break;
                        default:
                            res.status(422).json(null);

                    }

                    // Create document in Student/Teacher/Admin collection
                    db
                        .create(doc)
                        .then((newDoc) => {
                            // Generate a unique username, password

                            generateUniqueUsername(req.body.first_name, req.body.last_name)
                                .then((uniqueUsername) => {

                                    const username = uniqueUsername;
                                    const password = generatePassword(PASSWORD_LENGTH, PASSWORD_NUMBERS, PASSWORD_SYMBOLS);
                                    const profile = newDoc._id;

                                    const aDoc = {
                                        username,
                                        password,
                                        type,
                                        profile
                                    };

                                    let aDocHash = JSON.parse(JSON.stringify(aDoc));
                                    aDocHash.password = encryptPassword(aDoc.password);

                                    // Create document in Account collection
                                    accountDb
                                        .create(aDocHash)
                                        .then(() => {
                                            // Return account with unhashed password (exposing password ONLY once)
                                            res.json(aDoc);
                                        })
                                        .catch((err) => res.status(422).json(err))
                                })


                        })
                        .catch((err) => res.status(422).json(err))

                } else {
                    res.status(403).json(null);
                }
            })
    },
    updateAccount: function (req, res) {
        const updateAccountPassword = (req, res) => {
            verifyKey(JSON.parse(req.header('Authorization')).key, 'Student,Teacher,Admin')
                .then((isVerified) => {
                    if (isVerified) {
                        const {
                            oldPassword,
                            newPassword
                        } = JSON.parse(req.header('Authorization'));;

                        const aid = req.params.aid;

                        accountDb
                            .findOne({
                                _id: aid
                            })
                            .then((aDoc) => {
                                // Old password matches
                                if (verifyPassword(oldPassword, aDoc.password)) {
                                    accountDb
                                        .findOneAndUpdate({
                                            _id: aid
                                        }, {
                                            $set: {
                                                password: encryptPassword(newPassword)
                                            }
                                        })
                                        .then((newA) => {
                                            res.json(newA);
                                        })
                                        .catch((err) => res.status(422).json(err));
                                }
                                // Old password does not match
                                else {
                                    res.status(403).json(null);
                                }
                            })



                    } else {
                        res.status(403).json(null);
                    }
                })
        }
        const updateAccountName = (req, res) => {
            verifyKey(req.header('Authorization', 'Admin'))
                .then((isVerified) => {
                    if (isVerified) {
                        const {
                            first_name,
                            last_name
                        } = req.body;
                        const aid = req.params.aid;
                        let newDoc = {
                            first_name,
                            last_name,
                        };

                        accountDb
                            .findOne({
                                _id: aid
                            })
                            .then((aDoc) => {
                                if (aDoc) {
                                    const type = aDoc.type;
                                    let db;
                                    switch (type) {
                                        case "Student":
                                            db = StudentDb;
                                            break;
                                        case "Teacher":
                                            db = TeacherDb;
                                            break;
                                        case "Admin":
                                            db = AdminDb;
                                            break;
                                        default:
                                            res.status(422).json(null);

                                    }

                                    db.update({
                                        _id: aDoc.profile
                                    }, newDoc)
                                        .then(() => {
                                            res.json({});
                                        })
                                        .catch((err) => res.status(422).json(err));

                                } else {
                                    res.status(422).json(null);
                                }
                            })
                            .catch((err) => res.status(422).json(err));


                    } else {
                        res.status(403).json(null);
                    }
                })
        }

        switch (req.query.field) {
            case "password":
                updateAccountPassword(req, res);
                break;
            case "name":
                updateAccountName(req, res);
                break;
        }
    },
    deleteAccount: function (req, res) {
        verifyKey(req.header('Authorization'), 'Admin')
            .then((isVerified) => {
                if (isVerified) {
                    const aid = req.params.aid;
                    // Delete document in Account collection (A)
                    accountDb
                        .findOneAndDelete({
                            _id: aid
                        })
                        .then((deleted_account) => {
                            let promises = [];
                            const type = deleted_account.type;
                            const profile = deleted_account._id;
                            let db;
                            switch (type) {
                                case "Student":
                                    db = StudentDb;
                                    break;
                                case "Teacher":
                                    db = TeacherDb;
                                    break;
                                case "Admin":
                                    db = AdminDb;
                                    break;
                                default:
                                    res.status(422).json(null);
                            }

                            // Delete document in Student/Teacher/Admin collection (B)
                            promises.push(db.deleteOne({
                                _id: profile
                            }));

                            // Find Announcements created by this Account (B)
                            promises.push(announcementDb.find({
                                author: profile
                            }))

                            Promise
                                .all(promises)
                                .then((results) => {
                                    let announcementIDs = [];
                                    for (const announcement of results[1]) {
                                        announcementIDs.push(announcement._id);
                                    }

                                    // Delete References in Class collections (C)
                                    classDb
                                        .update({}, {
                                            $pull: {
                                                Students: profile,
                                                Teachers: profile,
                                                announcements: {
                                                    $in: announcementIDs
                                                }
                                            }
                                        })
                                        .then(() => {
                                            res.json({});
                                        })

                                })

                        })

                } else {
                    res.status(403).json(null);
                }
            })
    }
}