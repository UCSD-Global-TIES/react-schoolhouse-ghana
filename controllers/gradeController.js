const gradeDb = require("../models/Grade");
const studentDb = require("../models/Student");
const accountDb = require("../models/Account");
const API_PORT = process.env.PORT || 3001;

const {
    verifyKey
} = require("./verifyController");
const {
    processAnnouncements
} = require("./processAnnouncements");
module.exports = {
    getGrades: function (req, res) {
        verifyKey(req.header('Authorization'), 'Admin,Teacher')
            .then((authData) => {
                if (authData.isAuthorized) {
                    let query = {};
                    
                    if (authData.type === 'Teacher') {
                        query = { teachers: { $in: [authData.profile_id] } };
                    }
                    
                    gradeDb
                        .find(query)
                        .populate('subjects')
                        .then(gradeDocs => res.json(gradeDocs))
                        .catch(err => res.status(422).json(err));

                } else {
                    res.status(403).json(null);
                }
            })
    },
    getUserGrade: function (req, res) {
        verifyKey(req.header('Authorization'), 'Student,Teacher,Admin')
            .then((authData) => {
                if (authData.isAuthorized) {

                    const uid = req.params.uid;

                    // For teachers, find all grades they're assigned to
                    if (authData.type === 'Teacher') {
                        gradeDb
                            .find({
                                teachers: { $in: [uid] }
                            })
                            .populate({
                                path: 'subjects',
                                populate: {
                                    path: 'announcements',
                                    populate: {
                                        path: 'files'
                                    }
                                }
                            })
                            .then(async (gradeDocs) => {
                                if (!gradeDocs || gradeDocs.length === 0) {
                                    res.json([]);
                                    return;
                                }

                                const processedGrades = [];

                                for (const gradeDoc of gradeDocs) {
                                    // Process announcements for each grade
                                    for (let i = 0; i < gradeDoc.subjects.length; i++) {
                                        const currentSubject = gradeDoc.subjects[i];
                                        currentSubject.announcements = processAnnouncements(currentSubject.announcements);
                                    }

                                    // Process students for each grade
                                    const processedGrade = gradeDoc.toObject();
                                    processedGrade.students = [];

                                    for (let i = 0; i < gradeDoc.students.length; i++) {
                                        const currentStudent = gradeDoc.students[i];
                                        const studentDoc = await studentDb.findById(currentStudent);
                                        const accountDoc = await accountDb.findOne({
                                            profile: currentStudent
                                        });

                                        if (studentDoc && accountDoc) {
                                            processedGrade.students.push({
                                                firstName: studentDoc["first_name"],
                                                lastName: studentDoc["last_name"],
                                                id: studentDoc["_id"],
                                                username: accountDoc["username"],
                                                password: accountDoc["password"]
                                            });
                                        }
                                    }

                                    processedGrades.push(processedGrade);
                                }

                                res.json(processedGrades);
                            })
                            .catch(err => res.status(422).json(err));
                    } else {
                        // Original logic for students and admins
                        gradeDb
                            .findOne({
                                $or: [{
                                        students: {
                                            $in: [uid]
                                        }
                                    },
                                    {
                                        teachers: {
                                            $in: [uid]
                                        }
                                    }
                                ]
                            })
                            .populate({
                                path: 'subjects',
                                populate: {
                                    path: 'announcements',
                                    populate: {
                                        path: 'files'
                                    }
                                }
                            })
                            .then(async (gradeDoc) => {
                                if (!gradeDoc) {
                                    res.json(null);
                                    return;
                                }
                                
                                // Replace files for announcements
                                for (let i = 0; i < gradeDoc.subjects.length; i++) {
                                    const currentSubject = gradeDoc.subjects[i];
                                    currentSubject.announcements = processAnnouncements(currentSubject.announcements);
                                }

                                // Replace students with student object (names, etc)
                                for (let i = 0; i < gradeDoc.students.length; i++) {
                                    const currentStudent = gradeDoc.students[i];
                                    const studentDoc = await studentDb.findById(currentStudent);
                                    const accountDoc = await accountDb.findOne({
                                        profile: currentStudent
                                    });

                                    gradeDoc.students[i] = {
                                        firstName: studentDoc["first_name"],
                                        lastName: studentDoc["last_name"],
                                        id: studentDoc["_id"],
                                        username: accountDoc["username"],
                                        password: accountDoc["password"]
                                    };
                                }

                                res.json(gradeDoc);
                            })
                            .catch(err => res.status(422).json(err));
                    }
                } else {
                    res.status(403).json(null);
                }
            })
    },
    getGrade: function (req, res) {
        // Allow both Admin and Teacher to get individual grades
        verifyKey(req.header('Authorization'), 'Admin,Teacher')
            .then((authData) => {
                if (authData.isAuthorized) {

                    // Set query based on user type
                    let query = { _id: req.params.gid };
                    
                    //get grades where they are assigned
                    if (authData.type === 'Teacher') {
                        query.teachers = { $in: [authData.profile_id] };
                    }

                    gradeDb
                        .findOne(query)
                        .populate('subjects')
                        .populate('teachers')
                        .populate('students')
                        .then(gradeDoc => res.json(gradeDoc))
                        .catch(err => res.status(422).json(err));

                } else {
                    res.status(403).json(null);
                }
            })
    },
    addGrade: function (req, res) {
        verifyKey(req.header('Authorization'), 'Admin')
            .then((authData) => {
                if (authData.isAuthorized) {
                    // Create folder
                    let gradeDoc = req.body;

                    // Only remove students and subjects from other grades, allow teachers to be in multiple grades
                    gradeDb.updateMany({
                            $or: [{
                                    students: {
                                        $in: gradeDoc.students
                                    }
                                },
                                {
                                    subjects: {
                                        $in: gradeDoc.subjects
                                    }
                                }
                            ]
                        }, {
                            $pull: {
                                students: {
                                    $in: gradeDoc.students
                                },
                                subjects: {
                                    $in: gradeDoc.subjects
                                }
                            }
                        }
                    )
                    .then(() => {
                        // Create class document 
                        gradeDb
                            .create(gradeDoc)
                            .then((newG) =>
                                res.json(newG)
                            )
                    })
                    .catch(err => res.status(422).json(err));

                } else {
                    res.status(403).json(null);
                }
            })
    },
    updateGrade: function (req, res) {
        verifyKey(req.header('Authorization'), 'Admin')
            .then((authData) => {
                if (authData.isAuthorized) {
                    // Create folder
                    let gradeDoc = req.body;

                    // Only remove students and subjects from other grades, allow teachers to be in multiple grades
                    gradeDb.updateMany({
                            _id: { $ne: gradeDoc._id }, // Don't update the current grade
                            $or: [{
                                    students: {
                                        $in: gradeDoc.students
                                    }
                                },
                                {
                                    subjects: {
                                        $in: gradeDoc.subjects
                                    }
                                }
                            ]
                        }, {
                            $pull: {
                                students: {
                                    $in: gradeDoc.students
                                },
                                subjects: {
                                    $in: gradeDoc.subjects
                                }
                            }
                        }
                    )
                    .then(() => {
                        // Update class document 
                        gradeDb
                            .findOneAndUpdate({
                                _id: gradeDoc._id
                            }, gradeDoc)
                            .then((newG) =>
                                res.json(newG)
                            )
                    })
                    .catch(err => res.status(422).json(err));
                } else {
                    res.status(403).json(null);
                }
            })
    },
    deleteGrade: function (req, res) {
        verifyKey(req.header('Authorization'), 'Admin')
            .then((authData) => {
                if (authData.isAuthorized) {
                    const gid = req.params.gid;

                    gradeDb
                        .findOneAndDelete({
                            _id: gid
                        })
                        .then(() => {
                            res.json({});
                        })
                        .catch(err => res.status(422).json(err));

                } else {
                    res.status(403).json(null);
                }
            })
    },
}