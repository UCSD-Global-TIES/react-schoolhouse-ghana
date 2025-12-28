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
                                        // Get teacher's subjects for filtering admin announcements
                                        gradeDb.findOne({ 'subjectTeacherAssignments.teacher': currentUser.profile._id })
                                            .populate('subjectTeacherAssignments.subject')
                                            .populate('subjectTeacherAssignments.teacher')
                                            .then((teacherGrade) => {
                                                filteredAnnouncements = generalOnlyAnnouncements.filter(announcement => {
                                                    // Show general admin announcements (no subject targeting) if targeted to teachers
                                                    if (announcement.authorRole === 'Admin' && !announcement.subject && (!announcement.subjects || announcement.subjects.length === 0)) {
                                                        const targetAudience = announcement.targetAudience || 'both';
                                                        return targetAudience === 'both' || targetAudience === 'teachers';
                                                    }
                                                    
                                                    // Show targeted admin announcements only if teacher teaches those subjects and is in target audience
                                                    if (announcement.authorRole === 'Admin' && teacherGrade) {
                                                        const targetAudience = announcement.targetAudience || 'both';
                                                        const isTargetAudience = targetAudience === 'both' || targetAudience === 'teachers';
                                                        
                                                        if (isTargetAudience) {
                                                            const teacherSubjectIds = teacherGrade.subjectTeacherAssignments.map(a => a.subject._id.toString());
                                                            
                                                            // Check single subject
                                                            if (announcement.subject && teacherSubjectIds.includes(announcement.subject.toString())) {
                                                                return true;
                                                            }
                                                            
                                                            // Check multiple subjects
                                                            if (announcement.subjects && announcement.subjects.length > 0) {
                                                                return announcement.subjects.some(subjectId => 
                                                                    teacherSubjectIds.includes(subjectId.toString())
                                                                );
                                                            }
                                                        }
                                                    }
                                                    
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

                                                res.json(processAnnouncements(filteredAnnouncements));
                                            })
                                            .catch(err => res.status(422).json(err));
                                        return; // Early return for teacher case
                                    } else if (currentUser.type === 'Student') {
                                        // Students need additional filtering based on enrollment
                                        // First get student's enrolled subjects via grade
                                        gradeDb.findOne({ students: currentUser.profile._id })
                                            .populate('subjectTeacherAssignments.subject')
                                            .populate('subjectTeacherAssignments.teacher')
                                            .then((studentGrade) => {
                                                if (!studentGrade) {
                                                    // Student not enrolled in any grade, show only general admin announcements
                                                    filteredAnnouncements = generalOnlyAnnouncements.filter(announcement => 
                                                        announcement.authorRole === 'Admin' && !announcement.subject && (!announcement.subjects || announcement.subjects.length === 0)
                                                    );
                                                } else {
                                                    // Student enrolled, filter announcements based on enrollment
                                                    const studentSubjectIds = studentGrade.subjectTeacherAssignments.map(a => a.subject._id.toString());
                                                    
                                                    filteredAnnouncements = generalOnlyAnnouncements.filter(announcement => {
                                                        // Show general admin announcements (no subject targeting) if targeted to students
                                                        if (announcement.authorRole === 'Admin' && !announcement.subject && (!announcement.subjects || announcement.subjects.length === 0)) {
                                                            const targetAudience = announcement.targetAudience || 'both';
                                                            return targetAudience === 'both' || targetAudience === 'students';
                                                        }
                                                        
                                                        // Show targeted admin announcements only if student is enrolled in those subjects and is in target audience
                                                        if (announcement.authorRole === 'Admin') {
                                                            const targetAudience = announcement.targetAudience || 'both';
                                                            const isTargetAudience = targetAudience === 'both' || targetAudience === 'students';
                                                            
                                                            if (isTargetAudience) {
                                                                // Check single subject
                                                                if (announcement.subject && studentSubjectIds.includes(announcement.subject.toString())) {
                                                                    return true;
                                                                }
                                                                
                                                                // Check multiple subjects
                                                                if (announcement.subjects && announcement.subjects.length > 0) {
                                                                    return announcement.subjects.some(subjectId => 
                                                                        studentSubjectIds.includes(subjectId.toString())
                                                                    );
                                                                }
                                                            }
                                                            
                                                            return false; // Hide other targeted admin announcements
                                                        }
                                                        
                                                        // Show teacher announcements only from teachers in their grade
                                                        if (announcement.authorRole === 'Teacher' && announcement.authorId) {
                                                            return studentGrade.subjectTeacherAssignments.some(assignment => 
                                                                assignment.teacher && assignment.teacher._id.toString() === announcement.authorId.toString()
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
                                    
                                    // Admin users - filter out teacher announcements, only show admin announcements
                                    if (currentUser.type === 'Admin') {
                                        filteredAnnouncements = generalOnlyAnnouncements.filter(announcement => {
                                            // Only show admin announcements
                                            return announcement.authorRole === 'Admin';
                                        });
                                    }
                                    // Note: Teacher and Student cases return early above due to async grade lookup

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
                                subject: null,  // Ensure general announcements don't have a subject
                                targetAudience: req.body.targetAudience || 'both'  // Default to both if not specified
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
    addMultiSubjectAnnouncement: function (req, res) {
        const userKey = req.header('Authorization');
        verifyKey(userKey, 'Admin')
            .then((isVerified) => {
                if (isVerified) {
                    // Get user info to add as author
                    accountDb.findOne({ _id: userKey })
                        .populate('profile')
                        .then((account) => {
                            if (!account) {
                                return res.status(403).json({ error: 'User not found' });
                            }

                            const { subjects, ...announcementData } = req.body;

                            if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
                                return res.status(400).json({ error: 'At least one subject must be selected' });
                            }

                            // Create the base announcement data
                            const baseAnnouncementData = {
                                ...announcementData,
                                authorId: account._id,
                                authorRole: account.type,
                                authorName: `${account.profile.first_name} ${account.profile.last_name}`,
                                subjects: subjects,
                                private: false,  // Multi-subject admin announcements are public but targeted
                                targetAudience: announcementData.targetAudience || 'both'  // Default to both if not specified
                            };

                            // Create one announcement with multiple subjects
                            announcementDb
                                .create(baseAnnouncementData)
                                .then(newAnnouncement => {
                                    // Add this announcement to each selected subject
                                    const subjectUpdatePromises = subjects.map(subjectId => 
                                        subjectDb.updateOne(
                                            { _id: subjectId },
                                            { $push: { announcements: newAnnouncement._id } }
                                        )
                                    );

                                    Promise.all(subjectUpdatePromises)
                                        .then(() => {
                                            res.json(newAnnouncement);
                                        })
                                        .catch(err => res.status(422).json(err));
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