import React, { useState, useEffect } from 'react';
import {
    Paper,
    Typography,
    Box,
    Chip,
    Button,
    Grid,
    Card,
    CardContent,
    IconButton,
    Divider,
    Badge,
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    ListItemSecondaryAction
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
    School as SchoolIcon,
    Person as PersonIcon,
    MenuBook as SubjectIcon,
    Edit as EditIcon,
    ArrowBack as ArrowBackIcon,
    ArrowForward as ArrowForwardIcon
} from '@material-ui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChalkboardTeacher, faUserGraduate, faBook } from '@fortawesome/free-solid-svg-icons';
import API from '../../utils/API';
import StudentManagement from '../StudentManagement';
import SubjectTeacherManagement from '../SubjectTeacherManagement';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(3),
        maxWidth: 1200,
        margin: '0 auto'
    },
    header: {
        marginBottom: theme.spacing(2),
        padding: theme.spacing(1.5),
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: theme.spacing(1)
    },
    sectionNav: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: theme.spacing(2)
    },
    sectionButton: {
        margin: theme.spacing(0, 0.5),
        minWidth: '40px',
        height: '40px'
    },
    currentSection: {
        backgroundColor: theme.palette.primary.main,
        color: 'white'
    },
    statsCard: {
        textAlign: 'center',
        padding: theme.spacing(2)
    },
    tabContent: {
        marginTop: theme.spacing(2)
    },
    listItem: {
        borderRadius: theme.spacing(1),
        marginBottom: theme.spacing(0.5),
        '&:hover': {
            backgroundColor: theme.palette.grey[50]
        }
    },
    emptyState: {
        textAlign: 'center',
        padding: theme.spacing(4),
        color: theme.palette.grey[500]
    }
}));

function SectionDetail({ gradeId, gradeLevel, currentSection, onSectionChange, onEdit, user }) {
    const classes = useStyles();
    const [sectionData, setSectionData] = useState(null);
    const [availableSections, setAvailableSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);
    const [subjects, setSubjects] = useState([]);
    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    
    // Dialog states
    const [studentManagementOpen, setStudentManagementOpen] = useState(false);
    const [subjectTeacherManagementOpen, setSubjectTeacherManagementOpen] = useState(false);

    // Tab configuration
    const tabs = [
        { label: 'Overview', icon: <SchoolIcon /> },
        { label: 'Students', icon: <PersonIcon /> },
        { label: 'Teachers', icon: <FontAwesomeIcon icon={faChalkboardTeacher} /> },
        { label: 'Subjects', icon: <SubjectIcon /> }
    ];

    useEffect(() => {
        if (gradeLevel && currentSection && user) {
            fetchSectionData();
            fetchAvailableSections();
        }
    }, [gradeLevel, currentSection, user]);

    const fetchSectionData = async () => {
        try {
            setLoading(true);
            
            // Fetch all grades to find the current section
            const response = await API.getGrades(user.key);
            const grades = response.data;
            
            // Find the current section
            const section = grades.find(g => 
                g.level === parseInt(gradeLevel) && 
                g.section === currentSection
            );
            
            if (section) {
                console.log('📊 Section data loaded:', section);
                console.log('📚 Section subjectTeacherAssignments:', section.subjectTeacherAssignments);
                console.log('👥 Section students:', section.students);
                
                setSectionData(section);
                
                // Extract subjects and teachers from subjectTeacherAssignments
                const subjectIds = section.subjectTeacherAssignments?.map(a => 
                    typeof a.subject === 'string' ? a.subject : a.subject?._id || a.subject
                ) || [];
                
                const teacherIds = section.subjectTeacherAssignments
                    ?.filter(a => a.teacher)  // Only include assignments with teachers
                    .map(a => typeof a.teacher === 'string' ? a.teacher : a.teacher?._id || a.teacher) || [];
                
                // Remove duplicate teacher IDs
                const uniqueTeacherIds = [...new Set(teacherIds)];
                
                console.log('🔑 Extracted subject IDs:', subjectIds);
                console.log('🔑 Extracted teacher IDs:', uniqueTeacherIds);
                
                // Fetch detailed data for subjects, students, teachers
                const [subjectsRes, studentsRes, teachersRes] = await Promise.all([
                    fetchSubjectDetails(subjectIds),
                    fetchStudentDetails(section.students),
                    fetchTeacherDetails(uniqueTeacherIds)
                ]);
                
                console.log('📚 Fetched subjects:', subjectsRes);
                console.log('👥 Fetched students:', studentsRes);
                console.log('🧑‍🏫 Fetched teachers:', teachersRes);
                
                setSubjects(subjectsRes);
                setStudents(studentsRes);
                setTeachers(teachersRes);
            }
        } catch (error) {
            console.error('Error fetching section data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableSections = async () => {
        try {
            const response = await API.getGrades(user.key);
            const grades = response.data;
            
            // Find all sections for this grade level
            const sections = grades
                .filter(g => g.level === parseInt(gradeLevel))
                .map(g => g.section)
                .sort();
            
            setAvailableSections(sections);
        } catch (error) {
            console.error('Error fetching available sections:', error);
        }
    };

    const fetchSubjectDetails = async (subjectIds) => {
        console.log('🔍 fetchSubjectDetails called with:', subjectIds);
        if (!subjectIds || subjectIds.length === 0) {
            console.log('❌ No subject IDs provided');
            return [];
        }
        try {
            console.log('📡 Fetching all subjects from API...');
            const response = await API.getSubjects(user.key);
            console.log('📋 All available subjects:', response.data);
            
            // Convert subjectIds to strings for comparison (handles both ObjectIds and populated objects)
            const subjectIdStrings = subjectIds.map(id => {
                if (typeof id === 'string') return id;
                if (id && id._id) return id._id.toString();
                return id.toString();
            });
            
            console.log('🔑 Converted subject IDs:', subjectIdStrings);
            
            const matchedSubjects = response.data.filter(subject => {
                const isMatch = subjectIdStrings.includes(subject._id);
                console.log(`🔎 Checking subject ${subject.name} (${subject._id}): ${isMatch ? '✅ MATCH' : '❌ no match'}`);
                return isMatch;
            });
            
            console.log('🎯 Matched subjects for section:', matchedSubjects);
            return matchedSubjects;
        } catch (error) {
            console.error('Error fetching subject details:', error);
            return [];
        }
    };

    const fetchStudentDetails = async (studentIds) => {
        console.log('🔍 fetchStudentDetails called with:', studentIds);
        if (!studentIds || studentIds.length === 0) {
            console.log('❌ No student IDs provided');
            return [];
        }
        try {
            // Normalize IDs to strings to safely compare
            const studentIdStrings = studentIds.map(id => {
                const idString = typeof id === 'string' ? id : (id && id._id ? id._id.toString() : id.toString());
                console.log(`  🔑 Student ID: ${id} → normalized to: ${idString}`);
                return idString;
            });

            console.log('📡 Fetching all users from API...');
            const response = await API.getUsers(user.key);
            console.log(`📋 Total users fetched: ${response.data.length}`);
            
            const allStudents = response.data.filter(u => u.type === 'Student');
            console.log(`👥 Total students in system: ${allStudents.length}`);
            console.log('👥 Sample student profile_ids:', allStudents.slice(0, 3).map(s => s.profile_id));
            
            const matchedStudents = allStudents
                .filter(user => {
                    const isMatch = studentIdStrings.includes(user.profile_id);
                    if (isMatch) {
                        console.log(`  ✅ MATCHED: ${user.first_name} ${user.last_name} (profile_id: ${user.profile_id})`);
                    }
                    return isMatch;
                })
                .map(account => ({
                    _id: account.profile_id,
                    first_name: account.first_name,
                    last_name: account.last_name,
                    email: account.email,
                    createdAt: account.profile_createdAt,
                    updatedAt: account.profile_updatedAt
                }));
            
            console.log(`🎯 Matched ${matchedStudents.length} students:`, matchedStudents);
            return matchedStudents;
        } catch (error) {
            console.error('Error fetching student details:', error);
            return [];
        }
    };

    const fetchTeacherDetails = async (teacherIds) => {
        console.log('🔍 fetchTeacherDetails called with:', teacherIds);
        if (!teacherIds || teacherIds.length === 0) {
            console.log('❌ No teacher IDs provided');
            return [];
        }
        try {
            // Normalize IDs to strings to safely compare
            const teacherIdStrings = teacherIds.map(id => {
                const idString = typeof id === 'string' ? id : (id && id._id ? id._id.toString() : id.toString());
                console.log(`  🔑 Teacher ID: ${id} → normalized to: ${idString}`);
                return idString;
            });

            console.log('📡 Fetching all users from API...');
            const response = await API.getUsers(user.key);
            console.log(`📋 Total users fetched: ${response.data.length}`);
            
            const allTeachers = response.data.filter(u => u.type === 'Teacher');
            console.log(`🧑‍🏫 Total teachers in system: ${allTeachers.length}`);
            console.log('🧑‍🏫 Sample teacher profile_ids:', allTeachers.slice(0, 3).map(t => t.profile_id));
            
            const matchedTeachers = allTeachers
                .filter(user => {
                    const isMatch = teacherIdStrings.includes(user.profile_id);
                    if (isMatch) {
                        console.log(`  ✅ MATCHED: ${user.first_name} ${user.last_name} (profile_id: ${user.profile_id})`);
                    }
                    return isMatch;
                })
                .map(account => ({
                    _id: account.profile_id,
                    first_name: account.first_name,
                    last_name: account.last_name,
                    email: account.email,
                    createdAt: account.profile_createdAt,
                    updatedAt: account.profile_updatedAt
                }));
            
            console.log(`🎯 Matched ${matchedTeachers.length} teachers:`, matchedTeachers);
            return matchedTeachers;
        } catch (error) {
            console.error('Error fetching teacher details:', error);
            return [];
        }
    };

    const handleSectionNavigation = (section) => {
        if (section !== currentSection && onSectionChange) {
            onSectionChange(section);
        }
    };

    const handleStudentsUpdated = async (updatedStudentsList) => {
        console.log('Students updated:', updatedStudentsList);
        
        // Refetch the section data from backend to ensure we show what's actually saved
        await fetchSectionData();
    };

    const handleSubjectTeacherUpdated = async (subjectTeacherPairs, teacherIds) => {
        console.log('Subject-Teacher assignments updated:', subjectTeacherPairs);
        
        // Refetch the section data from backend to ensure we show what's actually saved
        await fetchSectionData();
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'primary';
            case 'unpublished': return 'default';
            case 'archived': return 'secondary';
            default: return 'default';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'active': return 'Active';
            case 'unpublished': return 'Draft';
            case 'archived': return 'Archived';
            default: return status;
        }
    };

    const handleStatusToggle = async () => {
        try {
            const newStatus = sectionData.status === 'active' ? 'archived' : 'active';
            
            // Normalize subjectTeacherAssignments
            const normalizedAssignments = Array.isArray(sectionData.subjectTeacherAssignments)
                ? sectionData.subjectTeacherAssignments.map(a => ({
                    subject: typeof a.subject === 'string' ? a.subject : (a.subject?._id || a.subject).toString(),
                    teacher: a.teacher ? (typeof a.teacher === 'string' ? a.teacher : (a.teacher?._id || a.teacher).toString()) : null
                }))
                : [];
            
            const updatedGradeData = {
                _id: sectionData._id,
                level: sectionData.level,
                section: sectionData.section,
                status: newStatus,
                subjectTeacherAssignments: normalizedAssignments,
                students: Array.isArray(sectionData.students)
                    ? sectionData.students.map(s => typeof s === 'string' ? s : (s._id || s).toString())
                    : [],
                createdAt: sectionData.createdAt,
                updatedAt: sectionData.updatedAt,
                __v: sectionData.__v
            };

            console.log('🔄 Toggling status to:', newStatus);
            await API.updateGrade(updatedGradeData, user.key);
            
            // Update local state
            setSectionData({ ...sectionData, status: newStatus });
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    if (loading) {
        return (
            <Box className={classes.root}>
                <Typography variant="h6">Loading section details...</Typography>
            </Box>
        );
    }

    if (!sectionData) {
        return (
            <Box className={classes.root}>
                <Typography variant="h6">Section not found.</Typography>
            </Box>
        );
    }

    return (
        <Box className={classes.root}>
            {/* Header with Section Info */}
            <Paper className={classes.header}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="h5" gutterBottom>
                            Grade {gradeLevel} Section {currentSection}
                        </Typography>
                        <Typography variant="body1" style={{ opacity: 0.9 }}>
                            {sectionData.createdAt && `Created ${new Date(sectionData.createdAt).toLocaleDateString()}`}
                        </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Chip 
                            label={getStatusLabel(sectionData.status)}
                            color={getStatusColor(sectionData.status)}
                            variant="outlined"
                            onClick={handleStatusToggle}
                            clickable
                            style={{ 
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                color: 'white',
                                borderColor: 'rgba(255,255,255,0.3)',
                                cursor: 'pointer'
                            }}
                        />
                    </Box>
                </Box>
            </Paper>


            {/* Stats Cards */}
            <Grid container spacing={3} style={{ marginBottom: 24 }}>
                <Grid item xs={12} md={4}>
                    <Card className={classes.statsCard}>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="center" marginBottom={1}>
                                <FontAwesomeIcon icon={faUserGraduate} size="2x" color="#1976d2" />
                            </Box>
                            <Typography variant="h4" color="primary">
                                {students.length}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Students Enrolled
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card className={classes.statsCard}>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="center" marginBottom={1}>
                                <FontAwesomeIcon icon={faChalkboardTeacher} size="2x" color="#388e3c" />
                            </Box>
                            <Typography variant="h4" color="primary">
                                {teachers.length}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Teachers Assigned
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card className={classes.statsCard}>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="center" marginBottom={1}>
                                <FontAwesomeIcon icon={faBook} size="2x" color="#f57c00" />
                            </Box>
                            <Typography variant="h4" color="primary">
                                {subjects.length}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Subjects Available
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Tabs for detailed views */}
            <Paper>
                <Tabs
                    value={tabValue}
                    onChange={(e, newValue) => setTabValue(newValue)}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                >
                    {tabs.map((tab, index) => (
                        <Tab
                            key={index}
                            label={tab.label}
                            icon={tab.icon}
                        />
                    ))}
                </Tabs>

                <Box className={classes.tabContent}>
                    {/* Overview Tab */}
                    {tabValue === 0 && (
                        <Box p={3}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h6" gutterBottom>
                                        Section Information
                                    </Typography>
                                    <List>
                                        <ListItem>
                                            <ListItemText 
                                                primary="Grade Level" 
                                                secondary={gradeLevel}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText 
                                                primary="Section" 
                                                secondary={currentSection}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText 
                                                primary="Status" 
                                                secondary={getStatusLabel(sectionData.status)}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText 
                                                primary="Created" 
                                                secondary={sectionData.createdAt ? new Date(sectionData.createdAt).toLocaleDateString() : 'N/A'}
                                            />
                                        </ListItem>
                                    </List>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h6" gutterBottom>
                                        Quick Summary
                                    </Typography>
                                    <List>
                                        <ListItem>
                                            <ListItemText 
                                                primary="Total Students" 
                                                secondary={`${students.length} enrolled`}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText 
                                                primary="Total Teachers" 
                                                secondary={`${teachers.length} assigned`}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText 
                                                primary="Total Subjects" 
                                                secondary={`${subjects.length} available`}
                                            />
                                        </ListItem>
                                    </List>
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {/* Students Tab */}
                    {tabValue === 1 && (
                        <Box p={3}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
                                <Typography variant="h6">
                                    Students ({students.length})
                                </Typography>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    startIcon={<EditIcon />}
                                    onClick={() => setStudentManagementOpen(true)}
                                >
                                    Manage Students
                                </Button>
                            </Box>
                            {students.length > 0 ? (
                                <List>
                                    {students.map((student) => (
                                        <ListItem key={student._id} className={classes.listItem}>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <PersonIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={`${student.first_name} ${student.last_name}`}
                                                secondary={student.email || 'No email provided'}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Box className={classes.emptyState}>
                                    <FontAwesomeIcon icon={faUserGraduate} size="3x" style={{ opacity: 0.3 }} />
                                    <Typography variant="body1" style={{ marginTop: 16 }}>
                                        No students enrolled in this section.
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        style={{ marginTop: 16 }}
                                        onClick={() => setStudentManagementOpen(true)}
                                    >
                                        Add Students
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    )}

                    {/* Teachers Tab */}
                    {tabValue === 2 && (
                        <Box p={3}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
                                <Typography variant="h6">
                                    Teachers ({teachers.length})
                                </Typography>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    startIcon={<EditIcon />}
                                    onClick={() => setSubjectTeacherManagementOpen(true)}
                                >
                                    Manage Subject Teachers
                                </Button>
                            </Box>
                            {teachers.length > 0 ? (
                                <List>
                                    {teachers.map((teacher) => (
                                        <ListItem key={teacher._id} className={classes.listItem}>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <FontAwesomeIcon icon={faChalkboardTeacher} />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={`${teacher.first_name} ${teacher.last_name}`}
                                                secondary={teacher.email || 'No email provided'}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Box className={classes.emptyState}>
                                    <FontAwesomeIcon icon={faChalkboardTeacher} size="3x" style={{ opacity: 0.3 }} />
                                    <Typography variant="body1" style={{ marginTop: 16 }}>
                                        No teachers assigned to this section.
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        style={{ marginTop: 16 }}
                                        onClick={() => onEdit && onEdit(sectionData)}
                                    >
                                        Assign Teachers
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    )}

                    {/* Subjects Tab */}
                    {tabValue === 3 && (
                        <Box p={3}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
                                <Typography variant="h6">
                                    Subjects ({subjects.length})
                                </Typography>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    startIcon={<EditIcon />}
                                    onClick={() => setSubjectTeacherManagementOpen(true)}
                                >
                                    Manage Subject Teachers
                                </Button>
                            </Box>
                            {subjects.length > 0 ? (
                                <List>
                                    {subjects.map((subject) => (
                                        <ListItem key={subject._id} className={classes.listItem}>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <SubjectIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={subject.name}
                                                secondary={subject.description || 'No description available'}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Box className={classes.emptyState}>
                                    <FontAwesomeIcon icon={faBook} size="3x" style={{ opacity: 0.3 }} />
                                    <Typography variant="body1" style={{ marginTop: 16 }}>
                                        No subjects assigned to this section.
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        style={{ marginTop: 16 }}
                                        onClick={() => onEdit && onEdit(sectionData)}
                                    >
                                        Add Subjects
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    )}
                </Box>
            </Paper>
            
            {/* Student Management Dialog */}
            <StudentManagement
                open={studentManagementOpen}
                onClose={() => setStudentManagementOpen(false)}
                gradeData={sectionData}
                onStudentsUpdated={handleStudentsUpdated}
                user={user}
            />
            
            {/* Subject-Teacher Management Dialog */}
            <SubjectTeacherManagement
                open={subjectTeacherManagementOpen}
                onClose={() => setSubjectTeacherManagementOpen(false)}
                gradeData={sectionData}
                onUpdated={handleSubjectTeacherUpdated}
                user={user}
            />
        </Box>
    );
}

export default SectionDetail;