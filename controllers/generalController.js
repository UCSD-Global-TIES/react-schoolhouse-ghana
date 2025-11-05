const announcementDb = require("../models/Announcement");
const subjectDb = require("../models/Subject");
const accountDb = require("../models/Account");
const gradeDb = require("../models/Grade");
const ip = require("ip")
const API_PORT = process.env.PORT || 3001;

// TODO
const {
    verifyKey
} = require("./verifyController");
const { processAnnouncements } = require("./processAnnouncements");

module.exports = {
    // SLOW ~ 2 seconds
    getAnnouncements: function (req, res) {
        const userKey = req.header('Authorization');
        verifyKey(userKey, 'Student,Teacher,Admin')
            .then((isVerified) => {
                if (isVerified) {
                    // Get current user info to filter announcements
                    accountDb.findOne({ _id: userKey })
                        .populate('profile')
                        .then((currentUser) => {
                            if (!currentUser) {
                                return res.status(403).json({ error: 'User not found' });
                            }

                            let query;
                            if (req.query.private === "false") {
                                // Only get general announcements (not subject-specific)
                                // Subject-specific announcements have a 'subject' field set
                                query = { 
                                    private: false,
                                    $or: [
                                        { subject: { $exists: false } },
                                        { subject: null },
                                        { subject: "" }  // Handle empty string case
                                    ]
                                };
                            }

                            announcementDb
                                .find(query)
                                .populate('files')
                                .then((announcements) => {
                                    // First, filter out any subject-specific announcements that may have slipped through
                                    let generalOnlyAnnouncements = announcements.filter(announcement => {
                                        // Keep only announcements that are truly general (no subject)
                                        return !announcement.subject || 
                                               announcement.subject === null || 
                                               announcement.subject === "" ||
                                               announcement.subject === undefined;
                                    });

                                    // Then filter based on user role and permissions
                                    let filteredAnnouncements = generalOnlyAnnouncements;

                                    if (currentUser.type === 'Teacher') {
                                        // Teachers can only see:
                                        // 1. Admin announcements
                                        // 2. Their own announcements
                                        // They should NOT see other teachers' announcements
                                        filteredAnnouncements = generalOnlyAnnouncements.filter(announcement => {
                                            // Show admin announcements
                                            if (announcement.authorRole === 'Admin') return true;
                                            
                                            // Show their own announcements
                                            if (announcement.authorId && announcement.authorId.toString() === currentUser._id.toString()) return true;
                                            
                                            // For legacy announcements without authorRole, check by authorName
                                            if (!announcement.authorRole && announcement.authorName) {
                                                const userFullName = `${currentUser.profile.first_name} ${currentUser.profile.last_name}`;
                                                return announcement.authorName === userFullName;
                                            }
                                            
                                            // Hide other teachers' announcements
                                            return false;
                                        });
                                    } else if (currentUser.type === 'Student') {
                                        // Students need additional filtering based on enrollment
                                        // First get student's enrolled subjects via grade
                                        gradeDb.findOne({ students: currentUser.profile._id })
                                            .populate('teachers')
                                            .then((studentGrade) => {
                                                if (!studentGrade) {
                                                    // Student not enrolled in any grade, show only admin announcements
                                                    filteredAnnouncements = generalOnlyAnnouncements.filter(announcement => 
                                                        announcement.authorRole === 'Admin'
                                                    );
                                                } else {
                                                    // Student enrolled, show admin announcements + teacher announcements from their teachers
                                                    filteredAnnouncements = generalOnlyAnnouncements.filter(announcement => {
                                                        // Show admin announcements
                                                        if (announcement.authorRole === 'Admin') return true;
                                                        
                                                        // Show teacher announcements only from teachers in their grade
                                                        if (announcement.authorRole === 'Teacher' && announcement.authorId) {
                                                            return studentGrade.teachers.some(teacher => 
                                                                teacher._id.toString() === announcement.authorId.toString()
                                                            );
                                                        }
                                                        
                                                        // For legacy announcements, we'll be permissive and show them
                                                        // You might want to restrict this further
                                                        if (!announcement.authorRole) return true;
                                                        
                                                        return false;
                                                    });
                                                }
                                                
                                                res.json(processAnnouncements(filteredAnnouncements));
                                            })
                                            .catch(err => res.status(422).json(err));
                                        return; // Early return for student case since we have async grade lookup
                                    }
                                    // Admin users see all announcements (existing behavior)
                                    // Note: Student case returns early above due to async grade lookup

                                    res.json(processAnnouncements(filteredAnnouncements));
                                })
                                .catch(err => res.status(422).json(err));
                        })
                        .catch(err => res.status(422).json(err));
                } else {
                    res.status(403).json(null);
                }
            })
    },
    addAnnouncement: function (req, res) {
        const userKey = req.header('Authorization');
        verifyKey(userKey, 'Teacher,Admin')
            .then((isVerified) => {
                if (isVerified) {
                    // Get user info to add as author
                    accountDb.findOne({ _id: userKey })
                        .populate('profile')
                        .then((account) => {
                            if (!account) {
                                return res.status(403).json({ error: 'User not found' });
                            }

                            // Add author information to the request body
                            const announcementData = {
                                ...req.body,
                                authorId: account._id,
                                authorRole: account.type,
                                authorName: `${account.profile.first_name} ${account.profile.last_name}`,
                                private: false,
                                subject: null  // Ensure general announcements don't have a subject
                            };

                            announcementDb
                                .create(announcementData)
                                .then(newA => {
                                    res.json(newA);
                                })
                                .catch(err => res.status(422).json(err));
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
        const userKey = req.header('Authorization');
        verifyKey(userKey, 'Teacher,Admin').then((isVerified) => {
            if (isVerified) {
                const aid = req.params.aid;

                // First, get the current user's information
                accountDb.findOne({ _id: userKey })
                    .then((currentUser) => {
                        if (!currentUser) {
                            return res.status(403).json({ error: 'User not found' });
                        }

                        // Get the announcement to check ownership
                        announcementDb.findOne({ _id: aid })
                            .then((announcement) => {
                                if (!announcement) {
                                    return res.status(404).json({ error: 'Announcement not found' });
                                }

                                // Permission check: Admins can update any announcement, Teachers can only update their own
                                const canUpdate = currentUser.type === 'Admin' || 
                                    (currentUser.type === 'Teacher' && announcement.authorId.toString() === currentUser._id.toString());

                                if (!canUpdate) {
                                    return res.status(403).json({ error: 'You do not have permission to update this announcement' });
                                }

                                // Proceed with update
                                announcementDb
                                    .findOneAndUpdate({
                                        _id: aid
                                    }, req.body, { new: true })
                                    .then(newA => res.json(newA))
                                    .catch(err => res.status(422).json(err));
                            })
                            .catch(err => res.status(422).json(err));
                    })
                    .catch(err => res.status(422).json(err));
            } else {
                res.status(403).json(null);
            }
        })

    }
}