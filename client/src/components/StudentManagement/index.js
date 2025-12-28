import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    Avatar,
    Checkbox,
    Typography,
    Box,
    Chip,
    CircularProgress,
    Divider,
    InputAdornment,
    IconButton,
    Tabs,
    Tab
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
    Search as SearchIcon,
    Person as PersonIcon,
    School as SchoolIcon,
    Add as AddIcon,
    Remove as RemoveIcon,
    Clear as ClearIcon
} from '@material-ui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate } from '@fortawesome/free-solid-svg-icons';
import API from '../../utils/API';

const useStyles = makeStyles((theme) => ({
    dialog: {
        '& .MuiDialog-paper': {
            minWidth: 600,
            maxWidth: 800,
            minHeight: 600,
        }
    },
    searchBox: {
        marginBottom: theme.spacing(2),
    },
    tabContent: {
        minHeight: 400,
        maxHeight: 400,
        overflowY: 'auto',
        marginTop: theme.spacing(1),
    },
    studentItem: {
        borderRadius: theme.spacing(1),
        marginBottom: theme.spacing(1),
        border: '1px solid #e0e0e0',
        '&:hover': {
            backgroundColor: '#f5f5f5'
        }
    },
    enrolledStudentItem: {
        borderRadius: theme.spacing(1),
        marginBottom: theme.spacing(1),
        border: '1px solid #4caf50',
        backgroundColor: '#f1f8e9',
    },
    emptyState: {
        textAlign: 'center',
        padding: theme.spacing(4),
        color: theme.palette.text.secondary,
    },
    statsChip: {
        margin: theme.spacing(0.5),
    },
    actionButtons: {
        display: 'flex',
        gap: theme.spacing(1),
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: theme.spacing(2),
        paddingTop: theme.spacing(2),
        borderTop: '1px solid #e0e0e0',
    }
}));

function StudentManagement({ 
    open, 
    onClose, 
    gradeData, 
    onStudentsUpdated,
    user 
}) {
    const classes = useStyles();
    
    // State management
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [allStudents, setAllStudents] = useState([]);
    const [enrolledStudents, setEnrolledStudents] = useState([]);
    const [availableStudents, setAvailableStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudents, setSelectedStudents] = useState(new Set());
    const [currentTab, setCurrentTab] = useState(0); // 0 = Available, 1 = Enrolled

    // Load students on component mount
    useEffect(() => {
        if (open && user?.key) {
            loadStudents();
        }
    }, [open, user?.key]);

    // Update enrolled students when gradeData changes
    useEffect(() => {
        if (gradeData?.students && allStudents.length > 0) {
            // gradeData.students contains IDs, need to find full student objects
            const enrolledStudentObjects = gradeData.students
                .map(studentId => allStudents.find(student => student._id === studentId))
                .filter(student => student !== undefined); // Remove any undefined entries
            
            setEnrolledStudents(enrolledStudentObjects);
        }
    }, [gradeData?.students, allStudents]);

    // Calculate available students (not in this section)
    useEffect(() => {
        if (enrolledStudents.length === 0) {
            // If no enrolled students, all are available
            setAvailableStudents([...allStudents]);
        } else {
            // Filter out enrolled students, with null safety
            const enrolledIds = new Set(enrolledStudents.filter(s => s && s._id).map(s => s._id));
            const available = allStudents.filter(student => !enrolledIds.has(student._id));
            setAvailableStudents(available);
        }
    }, [allStudents, enrolledStudents]);

    const loadStudents = async () => {
        setLoading(true);
        try {
            const response = await API.getUsers(user.key);
            const students = response.data
                .filter(account => account.type === 'Student')
                .map(account => ({
                    _id: account.profile_id,
                    first_name: account.first_name,
                    last_name: account.last_name,
                    email: account.email,
                    createdAt: account.profile_createdAt,
                    updatedAt: account.profile_updatedAt
                }));
            
            setAllStudents(students);
        } catch (error) {
            console.error('Error loading students:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter students based on search term
    const filterStudents = (students) => {
        if (!searchTerm.trim()) return students;
        
        const term = searchTerm.toLowerCase();
        return students.filter(student => 
            student.first_name?.toLowerCase().includes(term) ||
            student.last_name?.toLowerCase().includes(term) ||
            student.email?.toLowerCase().includes(term)
        );
    };

    // Handle student selection
    const handleStudentSelect = (studentId) => {
        const newSelected = new Set(selectedStudents);
        if (newSelected.has(studentId)) {
            newSelected.delete(studentId);
        } else {
            newSelected.add(studentId);
        }
        setSelectedStudents(newSelected);
    };

    // Add selected students to section
    const handleAddStudents = async () => {
        if (selectedStudents.size === 0) return;
        
        setSaving(true);
        try {
            console.log('🚀 handleAddStudents called');
            console.log('📊 Current gradeData:', gradeData);
            console.log('� gradeData.subjects:', gradeData.subjects);
            console.log('🧑‍🏫 gradeData.teachers:', gradeData.teachers);
            console.log('� gradeData.students:', gradeData.students);
            
            const studentsToAdd = availableStudents.filter(s => selectedStudents.has(s._id));
            const updatedStudentsList = [...enrolledStudents, ...studentsToAdd];
            
            console.log('🔍 Raw gradeData.subjectTeacherAssignments:', gradeData.subjectTeacherAssignments);
            console.log('🔍 Raw gradeData.students:', gradeData.students);
            
            // Normalize subjectTeacherAssignments to ensure clean structure
            const normalizedAssignments = Array.isArray(gradeData.subjectTeacherAssignments)
                ? gradeData.subjectTeacherAssignments.map(a => ({
                    subject: typeof a.subject === 'string' ? a.subject : (a.subject?._id || a.subject).toString(),
                    teacher: a.teacher ? (typeof a.teacher === 'string' ? a.teacher : (a.teacher?._id || a.teacher).toString()) : null
                }))
                : [];
            
            console.log('✅ Normalized assignments:', normalizedAssignments);
            console.log('✅ Student IDs to save:', updatedStudentsList.map(s => s._id));
            
            const updatedGradeData = {
                _id: gradeData._id,
                level: gradeData.level,
                section: gradeData.section,
                status: gradeData.status,
                subjectTeacherAssignments: normalizedAssignments,
                students: updatedStudentsList.map(s => s._id),
                createdAt: gradeData.createdAt,
                updatedAt: gradeData.updatedAt,
                __v: gradeData.__v
            };

            console.log('💾 === FINAL DATA BEING SENT TO API ===');
            console.log('📊 updatedGradeData:', JSON.stringify(updatedGradeData, null, 2));
            const response = await API.updateGrade(updatedGradeData, user.key);
            console.log('✅ API.updateGrade response:', response);
            
            setEnrolledStudents(updatedStudentsList);
            setSelectedStudents(new Set());
            setCurrentTab(1); // Switch to enrolled tab
            
            if (onStudentsUpdated) {
                onStudentsUpdated(updatedStudentsList);
            }
        } catch (error) {
            console.error('Error adding students:', error);
        } finally {
            setSaving(false);
        }
    };

    // Remove selected students from section
    const handleRemoveStudents = async () => {
        if (selectedStudents.size === 0) return;
        
        setSaving(true);
        try {
            const updatedStudentsList = enrolledStudents.filter(s => !selectedStudents.has(s._id));
            
            // Normalize subjectTeacherAssignments
            const normalizedAssignments = Array.isArray(gradeData.subjectTeacherAssignments)
                ? gradeData.subjectTeacherAssignments.map(a => ({
                    subject: typeof a.subject === 'string' ? a.subject : (a.subject?._id || a.subject).toString(),
                    teacher: a.teacher ? (typeof a.teacher === 'string' ? a.teacher : (a.teacher?._id || a.teacher).toString()) : null
                }))
                : [];
            
            const updatedGradeData = {
                _id: gradeData._id,
                level: gradeData.level,
                section: gradeData.section,
                status: gradeData.status,
                subjectTeacherAssignments: normalizedAssignments,
                students: updatedStudentsList.map(s => s._id),
                createdAt: gradeData.createdAt,
                updatedAt: gradeData.updatedAt,
                __v: gradeData.__v
            };

            console.log('💾 Removing students, sending:', updatedGradeData);
            await API.updateGrade(updatedGradeData, user.key);
            
            setEnrolledStudents(updatedStudentsList);
            setSelectedStudents(new Set());
            
            if (onStudentsUpdated) {
                onStudentsUpdated(updatedStudentsList);
            }
        } catch (error) {
            console.error('Error removing students:', error);
        } finally {
            setSaving(false);
        }
    };

    // Select all visible students
    const handleSelectAll = () => {
        const currentStudents = currentTab === 0 ? 
            filterStudents(availableStudents) : 
            filterStudents(enrolledStudents);
        
        const allIds = new Set(currentStudents.map(s => s._id));
        setSelectedStudents(allIds);
    };

    // Clear selection
    const handleClearSelection = () => {
        setSelectedStudents(new Set());
    };

    // Render student list
    const renderStudentList = (students, showAddButton = false) => {
        const filteredStudents = filterStudents(students);
        
        if (filteredStudents.length === 0) {
            return (
                <Box className={classes.emptyState}>
                    <FontAwesomeIcon icon={faUserGraduate} size="3x" style={{ opacity: 0.3 }} />
                    <Typography variant="body1" style={{ marginTop: 16 }}>
                        {searchTerm ? 'No students found matching your search.' : 
                         showAddButton ? 'No students available to add.' : 'No students enrolled in this section.'}
                    </Typography>
                </Box>
            );
        }

        return (
            <List>
                {filteredStudents.map((student) => (
                    <ListItem 
                        key={student._id}
                        className={showAddButton ? classes.studentItem : classes.enrolledStudentItem}
                        button
                        onClick={() => handleStudentSelect(student._id)}
                    >
                        <ListItemAvatar>
                            <Avatar>
                                <PersonIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={`${student.first_name} ${student.last_name}`}
                            secondary={student.email}
                        />
                        <ListItemSecondaryAction>
                            <Checkbox
                                edge="end"
                                onChange={() => handleStudentSelect(student._id)}
                                checked={selectedStudents.has(student._id)}
                            />
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        );
    };

    if (loading) {
        return (
            <Dialog open={open} className={classes.dialog}>
                <DialogContent style={{ textAlign: 'center', padding: '60px 40px' }}>
                    <CircularProgress />
                    <Typography variant="body1" style={{ marginTop: 16 }}>
                        Loading students...
                    </Typography>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onClose={onClose} className={classes.dialog} maxWidth="md">
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="h6">
                            Manage Students - Grade {gradeData?.level} Section {gradeData?.section}
                        </Typography>
                        <Box display="flex" gap={1} mt={1}>
                            <Chip 
                                label={`${enrolledStudents.length} Enrolled`} 
                                color="primary" 
                                size="small"
                                className={classes.statsChip}
                            />
                            <Chip 
                                label={`${availableStudents.length} Available`} 
                                variant="outlined" 
                                size="small"
                                className={classes.statsChip}
                            />
                        </Box>
                    </Box>
                    <IconButton onClick={onClose}>
                        <ClearIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            
            <DialogContent>
                {/* Search Box */}
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search students by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={classes.searchBox}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                        endAdornment: searchTerm && (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setSearchTerm('')}>
                                    <ClearIcon />
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />

                {/* Tabs */}
                <Tabs 
                    value={currentTab} 
                    onChange={(e, newValue) => setCurrentTab(newValue)}
                    indicatorColor="primary"
                    textColor="primary"
                >
                    <Tab label={`Available Students (${filterStudents(availableStudents).length})`} />
                    <Tab label={`Enrolled Students (${filterStudents(enrolledStudents).length})`} />
                </Tabs>

                {/* Tab Content */}
                <Box className={classes.tabContent}>
                    {currentTab === 0 && renderStudentList(availableStudents, true)}
                    {currentTab === 1 && renderStudentList(enrolledStudents, false)}
                </Box>

                {/* Action Buttons */}
                {(currentTab === 0 ? availableStudents : enrolledStudents).length > 0 && (
                    <Box className={classes.actionButtons}>
                        <Box>
                            <Button 
                                variant="outlined" 
                                size="small" 
                                onClick={handleSelectAll}
                                disabled={saving}
                            >
                                Select All ({filterStudents(currentTab === 0 ? availableStudents : enrolledStudents).length})
                            </Button>
                            {selectedStudents.size > 0 && (
                                <Button 
                                    variant="outlined" 
                                    size="small" 
                                    onClick={handleClearSelection}
                                    style={{ marginLeft: 8 }}
                                    disabled={saving}
                                >
                                    Clear ({selectedStudents.size})
                                </Button>
                            )}
                        </Box>
                        
                        {selectedStudents.size > 0 && (
                            <Button
                                variant="contained"
                                color={currentTab === 0 ? "primary" : "secondary"}
                                startIcon={currentTab === 0 ? <AddIcon /> : <RemoveIcon />}
                                onClick={currentTab === 0 ? handleAddStudents : handleRemoveStudents}
                                disabled={saving}
                            >
                                {saving && <CircularProgress size={16} style={{ marginRight: 8 }} />}
                                {currentTab === 0 ? `Add ${selectedStudents.size} Student${selectedStudents.size > 1 ? 's' : ''}` 
                                                  : `Remove ${selectedStudents.size} Student${selectedStudents.size > 1 ? 's' : ''}`}
                            </Button>
                        )}
                    </Box>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default StudentManagement;