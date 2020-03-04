const accountDb = require("../models/Account");
const StudentDb = require("../models/Student");
const TeacherDb = require("../models/Teacher");
const AdminDb = require("../models/Admin");
const gradeDb = require("../models/Grade");

const {
    verifyKey
} = require("./verifyController");

const {
    // generatePassword,
    encryptPassword,
    // verifyPassword
} = require("../scripts/encrypt");

// const PASSWORD_LENGTH = 6;
// const PASSWORD_NUMBERS = true;
// const PASSWORD_SYMBOLS = false;

const generateUniqueUsername = (first_name, last_name) => {
    const MAX_LASTNAME_LENGTH = 3;
    const NUM_TAG_LENGTH = 2;

    const generateTag = (length) => {
        let tag = "";

        for (let i = 0; i < length; i++) {
            const numStr = (Math.floor(Math.random() * 10)).toString(10);
            tag = tag.concat(numStr);
        }

        return tag;

    }

    const generateUsername = (first_name, last_name) => {
        let lastNameLength = 0;
        if (last_name.length < MAX_LASTNAME_LENGTH) {
            lastNameLength = last_name.length;
        } else {
            lastNameLength = MAX_LASTNAME_LENGTH;
        }

        return first_name.charAt(0).toLowerCase() + last_name.substr(0, lastNameLength) + generateTag(NUM_TAG_LENGTH);

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

                    const { first_name, last_name, grade } = req.body.profile;
                    const { password, type } = req.body.account;

                    let doc;
                    let db;

                    doc = {
                        first_name,
                        last_name
                    }

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

                    // Create document in Student/Teacher/Admin collection
                    db
                        .create(doc)
                        .then((newProfile) => {

                            // Generate a unique username, password

                            generateUniqueUsername(first_name, last_name)
                                .then((uniqueUsername) => {

                                    const username = uniqueUsername;
                                    const profile = newProfile._id;

                                    const aDoc = {
                                        username,
                                        password,
                                        type,
                                        profile
                                    };

                                    let aDocHash = JSON.parse(JSON.stringify(aDoc));
                                    aDocHash.password = encryptPassword(aDoc.password);

                                    const promises = [];

                                    // Create document in Account collection
                                    promises.push(accountDb.create(aDocHash));
                                    if (grade) {
                                        let updateObj = {};
                                        if (type === 'Student') {
                                            updateObj = { students: profile }
                                        }
                                        else if (type === 'Teacher') {
                                            updateObj = { teachers: profile }

                                        }

                                        promises.push(
                                            gradeDb.findOneAndUpdate({ _id: grade }, {
                                                $push: updateObj
                                            })
                                        )

                                    }

                                    Promise.all(promises)
                                        .then(() => {

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
        verifyKey(req.header('Authorization'), 'Admin')
            .then((isVerified) => {
                if (isVerified) {

                    const { first_name, last_name, grade, _id: profile_id } = req.body.profile;
                    const { password, type, _id: account_id } = req.body.account;

                    let doc;
                    let db;

                    doc = {
                        first_name,
                        last_name
                    }

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

                    // Create document in Student/Teacher/Admin collection
                    db
                        .findOneAndUpdate({ _id: profile_id }, doc)
                        .then(() => {
                            const promises = [];

                            // Update document in Account collection
                            promises.push(accountDb
                                .findOneAndUpdate(
                                    {
                                        _id: account_id
                                    },
                                    {
                                        password
                                    }));

                            let updateObj = {};
                            if (grade) {
                                if (type === 'Student') {
                                    updateObj = { students: profile_id }
                                }
                                else if (type === 'Teacher') {
                                    updateObj = { teachers: profile_id }

                                }

                                promises.push(
                                    gradeDb.updateMany(
                                        {
                                            $or: [
                                                {
                                                    students: {
                                                        $elemMatch: {
                                                            $eq: profile_id
                                                        }
                                                    }
                                                },
                                                {
                                                    teachers: {
                                                        $elemMatch: {
                                                            $eq: profile_id
                                                        }
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            $pull: {
                                                students: profile_id,
                                                teachers: profile_id
                                            }
                                        }
                                    )
                                )

                            }

                            Promise.all(promises)
                                .then(() => {
                                    if (grade) {

                                        gradeDb.findOneAndUpdate({ _id: grade },
                                            {
                                                $push: updateObj
                                            }).then(() => {
                                                res.json({})
                                            })
                                            .catch((err) => res.status(422).json(err))
                                    } else {
                                        res.json({})
                                    }
                                })
                                .catch((err) => res.status(422).json(err))
                        })
                        .catch((err) => res.status(422).json(err))

                } else {
                    res.status(403).json(null);
                }
            })
    },
    deleteAccount: function (req, res) {
        verifyKey(req.header('Authorization'), 'Admin')
            .then((isVerified) => {
                if (isVerified) {

                    const aid = req.params.aid;

                    accountDb
                        .findOneAndDelete({ _id: aid })
                        .then((deleted_account) => {
                            const { type, profile: profile_id } = deleted_account;

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

                            const promises = [];

                            promises.push(db.findOneAndDelete({ _id: profile_id }));
                            promises.push(
                                gradeDb.updateMany(
                                    {
                                        $or: [
                                            {
                                                students: {
                                                    $elemMatch: {
                                                        $eq: profile_id
                                                    }
                                                }
                                            },
                                            {
                                                teachers: {
                                                    $elemMatch: {
                                                        $eq: profile_id
                                                    }
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        $pull: {
                                            students: profile_id,
                                            teachers: profile_id
                                        }
                                    }
                                )
                            )

                            Promise.all(promises)
                                .then(() => {
                                    res.json({})
                                })
                                .catch((err) => res.status(422).json(err))

                        })

                } else {
                    res.status(403).json(null);
                }
            })
    },
    getAccounts: function (req, res) {
        verifyKey(req.header('Authorization'), 'Admin')
            .then((isVerified) => {
                if (isVerified) {

                    accountDb
                        .find({})
                        .populate('profile')
                        .then((accounts) => {
                            const combinedAccountProfiles = []
                            for (let account of accounts) {
                                const { username, password, type, createdAt, updatedAt, _id } = account;
                                const { first_name, last_name, _id: profile_id, createdAt: profile_createdAt, updatedAt: profile_updatedAt } = account.profile;
                                combinedAccountProfiles.push({
                                    _id,
                                    username,
                                    password,
                                    type,
                                    profile_id,
                                    profile_createdAt,
                                    profile_updatedAt,
                                    first_name,
                                    last_name,
                                    createdAt,
                                    updatedAt
                                })
                            }
                            res.json(combinedAccountProfiles);
                        })
                        .catch((err) => res.status(422).json(err));
                } else {
                    res.status(403).json(null);
                }
            })
    }
}