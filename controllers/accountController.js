const accountDb = require("../models/Account");
const studentDb = require("../models/Student");
const teacherDb = require("../models/Teacher");
const adminDb = require("../models/Admin");

// TODO
const {
    verifyKey
} = require("./verifyController");

module.exports = {
    addAccount: function (req, res) {
        verifyKey(req.header('Authorization'))
            .then((isVerified) => {
                if (isVerified) {
                    // Client provides first_name, last_name, type, Grade _id (if student)
                    // Server generates username, password

                    const type = req.body.type;
                    let doc;
                    let db;
                    switch (type) {
                        case "student":
                            doc = {
                                first_name: req.body.first_name,
                                last_name: req.body.last_name,
                                grade: req.body.grade
                            }
                            db = studentDb;
                            break;
                        case "teacher":
                            doc = {
                                first_name: req.body.first_name,
                                last_name: req.body.last_name,
                            }
                            db = teacherDb;
                            break;
                        case "admin":
                            doc = {
                                first_name: req.body.first_name,
                                last_name: req.body.last_name,
                            }
                            db = adminDb;
                            break;
                        default:
                            res.status(422).json(null);

                    }

                    // Create document in Student/Teacher/Admin collection
                    db
                        .create(doc)
                        .then((newDoc) => {
                            // Generate a unique username, password
                            const username = "";
                            const password = "";
                            const profile = newDoc._id

                            const aDoc = {
                                username,
                                password,
                                type,
                                profile
                            };

                            // Create document in Account collection
                            accountDb
                                .create(aDoc)
                                .then((newA) => {

                                    res.json(newA);
                                })
                                .catch((err) => res.status(422).json(err))


                        })
                        .catch((err) => res.status(422).json(err))

                }
            })
    },
    updateAccount: function (req, res) {
        verifyKey(req.header('Authorization'))
            .then((isVerified) => {
                if (isVerified) {
                    // Update 



                }
            })
    },
    deleteAccount: function (req, res) {
        verifyKey(req.header('Authorization'))
            .then((isVerified) => {
                if (isVerified) {

                    // Delete document in Student/Teacher/Admin collection

                    // Delete References in Announcement/Class collections

                    // Delete document in Account collection

                }
            })
    }
}