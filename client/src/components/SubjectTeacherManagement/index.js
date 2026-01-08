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
    ListItemText,
    ListItemSecondaryAction,
    Typography,
    Box,
    Chip,
    CircularProgress,
    Divider,
    IconButton,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Card,
    CardContent,
    Grid,
    Tooltip,
    Fab
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
    School as SchoolIcon,
    Person as PersonIcon,
    Add as AddIcon,
    Remove as RemoveIcon,
    Clear as ClearIcon,
    Edit as EditIcon,
    Save as SaveIcon,
    Cancel as CancelIcon
} from '@material-ui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChalkboardTeacher, faBook } from '@fortawesome/free-solid-svg-icons';
import API from '../../utils/API';

const useStyles = makeStyles((theme) => ({
    dialog: {
        '& .MuiDialog-paper': {
            minWidth: 700,
            maxWidth: 900,
            minHeight: 600,
        }
    },
    subjectCard: {
        marginBottom: theme.spacing(2),
        border: '1px solid #e0e0e0',
        '&:hover': {
            borderColor: theme.palette.primary.main,
            boxShadow: theme.shadows[2]
        }
    },
    assignedCard: {
        marginBottom: theme.spacing(2),
        border: '2px solid #4caf50',
        backgroundColor: '#f1f8e9',
    },
    unassignedCard: {
        marginBottom: theme.spacing(2),
        border: '1px solid #ff9800',
        backgroundColor: '#fff3e0',
    },
    subjectHeader: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: theme.spacing(1),
    },
    teacherSelect: {
        minWidth: 200,
    },
    addSubjectSection: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        border: '2px dashed #ccc',
        borderRadius: theme.spacing(1),
        textAlign: 'center',
    },
    statsChip: {
        margin: theme.spacing(0.5),
    },
    emptyState: {
        textAlign: 'center',
        padding: theme.spacing(4),
        color: theme.palette.text.secondary,
    },
    actionButtons: {
        display: 'flex',
        gap: theme.spacing(1),
        marginTop: theme.spacing(1),
    }
}));

function SubjectTeacherManagement({ 
    open, 
    onClose, 
    gradeData, 
    onUpdated,
    user 
}) {
    const classes = useStyles();
    
    // State management
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [allSubjects, setAllSubjects] = useState([]);
    const [allTeachers, setAllTeachers] = useState([]);
    const [subjectTeacherPairs, setSubjectTeacherPairs] = useState([]);
    const [newSubjectId, setNewSubjectId] = useState('');
    const [hasChanges, setHasChanges] = useState(false);

    // Load data on component mount
    useEffect(() => {
        if (open && user?.key) {
            loadData();
        }
    }, [open, user?.key]);

    // Initialize subject-teacher pairs from grade data
    useEffect(() => {
        if (gradeData && allSubjects.length > 0 && allTeachers.length > 0) {
            initializeSubjectTeacherPairs();
        }
    }, [gradeData?.subjectTeacherAssignments, gradeData?.subjects, gradeData?.teachers, allSubjects, allTeachers]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [subjectsResponse, usersResponse] = await Promise.all([
                API.getSubjects(user.key),
                API.getUsers(user.key)
            ]);

            setAllSubjects(subjectsResponse.data);
            
            const teachers = usersResponse.data
                .filter(account => account.type === 'Teacher')
                .map(account => ({
                    _id: account.profile_id,
                    first_name: account.first_name,
                    last_name: account.last_name,
                    email: account.email
                }));
            
            setAllTeachers(teachers);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const initializeSubjectTeacherPairs = () => {
        console.log('🔄 Initializing subject-teacher pairs');
        console.log('📊 Grade data:', gradeData);
        console.log('📚 subjectTeacherAssignments:', gradeData.subjectTeacherAssignments);
        console.log('📚 OLD subjects array:', gradeData.subjects);
        console.log('🧑‍🏫 OLD teachers array:', gradeData.teachers);
        
        let pairs = [];
        
        // Check if we have the new structure (subjectTeacherAssignments)
        if (gradeData.subjectTeacherAssignments && gradeData.subjectTeacherAssignments.length > 0) {
            console.log('✅ Using NEW schema: subjectTeacherAssignments');
            const assignments = gradeData.subjectTeacherAssignments;
            
            pairs = assignments.map(assignment => {
                // Extract IDs from potentially populated objects
                const subjectId = typeof assignment.subject === 'string' 
                    ? assignment.subject 
                    : assignment.subject?._id || assignment.subject;
                const teacherId = typeof assignment.teacher === 'string'
                    ? assignment.teacher
                    : assignment.teacher?._id || assignment.teacher;
                
                // Find full objects from loaded data
                const subject = allSubjects.find(s => s._id === subjectId);
                const teacher = teacherId ? allTeachers.find(t => t._id === teacherId) : null;
                
                console.log(`📚 Processing assignment - Subject ID: ${subjectId}, Teacher ID: ${teacherId}`);
                
                return {
                    subjectId: subjectId,
                    subjectName: subject?.name || 'Unknown Subject',
                    teacherId: teacherId || null,
                    teacherName: teacher ? `${teacher.first_name} ${teacher.last_name}` : null
                };
            });
        } 
        // Fallback to OLD schema (separate subjects and teachers arrays)
        else if (gradeData.subjects && gradeData.subjects.length > 0) {
            console.log('⚠️ Using OLD schema: migrating subjects/teachers arrays to subjectTeacherAssignments');
            const subjectIds = gradeData.subjects.map(s => 
                typeof s === 'string' ? s : s._id || s
            );
            
            // For old schema, we can't know which teacher teaches which subject
            // So we'll just create pairs with no teachers initially
            pairs = subjectIds.map(subjectId => {
                const subject = allSubjects.find(s => s._id === subjectId);
                
                return {
                    subjectId: subjectId,
                    subjectName: subject?.name || 'Unknown Subject',
                    teacherId: null, // No teacher assigned in old schema
                    teacherName: null
                };
            });
            
            console.log('📊 Migrated from old schema - teachers need to be reassigned to subjects');
        }
        
        console.log('📊 Final subject-teacher pairs:', pairs);
        setSubjectTeacherPairs(pairs);
    };

    const getTeacherName = (teacherId) => {
        const teacher = allTeachers.find(t => t._id === teacherId);
        return teacher ? `${teacher.first_name} ${teacher.last_name}` : 'Unknown Teacher';
    };

    const handleTeacherAssignment = (subjectId, teacherId) => {
        setSubjectTeacherPairs(prev => 
            prev.map(pair => 
                pair.subjectId === subjectId 
                    ? { 
                        ...pair, 
                        teacherId: teacherId || null,
                        teacherName: teacherId ? getTeacherName(teacherId) : null
                      }
                    : pair
            )
        );
        setHasChanges(true);
    };

    const handleRemoveSubject = (subjectId) => {
        setSubjectTeacherPairs(prev => prev.filter(pair => pair.subjectId !== subjectId));
        setHasChanges(true);
    };

    const handleAddSubject = () => {
        if (!newSubjectId) return;
        
        const subject = allSubjects.find(s => s._id === newSubjectId);
        if (!subject) return;

        // Check if subject already exists
        const exists = subjectTeacherPairs.some(pair => pair.subjectId === newSubjectId);
        if (exists) return;

        const newPair = {
            subjectId: newSubjectId,
            subjectName: subject.name,
            teacherId: null,
            teacherName: null
        };

        setSubjectTeacherPairs(prev => [...prev, newPair]);
        setNewSubjectId('');
        setHasChanges(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            console.log('🚀 handleSave called in SubjectTeacherManagement');
            console.log('📊 Current gradeData:', gradeData);
            console.log('📚 Current pairs:', subjectTeacherPairs);
            
            // Build subjectTeacherAssignments array from pairs
            const subjectTeacherAssignments = subjectTeacherPairs.map(pair => ({
                subject: pair.subjectId,
                teacher: pair.teacherId || null  // null if no teacher assigned
            }));

            console.log('📝 Built subjectTeacherAssignments:', subjectTeacherAssignments);

            // Normalize student IDs
            const studentIds = Array.isArray(gradeData.students) 
                ? gradeData.students.map(s => {
                    if (typeof s === 'string') return s;
                    if (typeof s === 'object' && s._id) return s._id.toString();
                    return s.toString();
                })
                : [];

            // Create update object with new structure
            const updatedGradeData = {
                _id: gradeData._id,
                level: gradeData.level,
                section: gradeData.section,
                status: gradeData.status,
                subjectTeacherAssignments: subjectTeacherAssignments,
                students: studentIds,
                createdAt: gradeData.createdAt,
                updatedAt: gradeData.updatedAt,
                __v: gradeData.__v
            };

            console.log('💾 Sending to API.updateGrade:', updatedGradeData);
            const response = await API.updateGrade(updatedGradeData, user.key);
            console.log('✅ API.updateGrade response:', response);

            // Extract unique teacher IDs for parent callback
            const uniqueTeachers = [...new Set(
                subjectTeacherPairs
                    .filter(pair => pair.teacherId)
                    .map(pair => pair.teacherId)
            )];

            // Update parent component
            if (onUpdated) {
                onUpdated(subjectTeacherPairs, uniqueTeachers);
            }

            setHasChanges(false);
            onClose();
        } catch (error) {
            console.error('Error saving subject-teacher assignments:', error);
        } finally {
            setSaving(false);
        }
    };

    const getAvailableSubjects = () => {
        const assignedIds = new Set(subjectTeacherPairs.map(pair => pair.subjectId));
        return allSubjects.filter(subject => !assignedIds.has(subject._id));
    };

    const getAssignmentStats = () => {
        const totalSubjects = subjectTeacherPairs.length;
        const assignedSubjects = subjectTeacherPairs.filter(pair => pair.teacherId).length;
        const unassignedSubjects = totalSubjects - assignedSubjects;
        
        return { totalSubjects, assignedSubjects, unassignedSubjects };
    };

    if (loading) {
        return (
            <Dialog open={open} className={classes.dialog}>
                <DialogContent style={{ textAlign: 'center', padding: '60px 40px' }}>
                    <CircularProgress />
                    <Typography variant="body1" style={{ marginTop: 16 }}>
                        Loading subjects and teachers...
                    </Typography>
                </DialogContent>
            </Dialog>
        );
    }

    const stats = getAssignmentStats();
    const availableSubjects = getAvailableSubjects();

    return (
        <Dialog open={open} onClose={onClose} className={classes.dialog} maxWidth="md">
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="h6">
                            Subject-Teacher Management - Grade {gradeData?.level} Section {gradeData?.section}
                        </Typography>
                        <Box display="flex" gap={1} mt={1}>
                            <Chip 
                                label={`${stats.totalSubjects} Subjects`} 
                                color="primary" 
                                size="small"
                                className={classes.statsChip}
                            />
                            <Chip 
                                label={`${stats.assignedSubjects} Assigned`} 
                                style={{ backgroundColor: '#4caf50', color: 'white' }}
                                size="small"
                                className={classes.statsChip}
                            />
                            <Chip 
                                label={`${stats.unassignedSubjects} Unassigned`} 
                                style={{ backgroundColor: '#ff9800', color: 'white' }}
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
                {subjectTeacherPairs.length === 0 ? (
                    <Box className={classes.emptyState}>
                        <FontAwesomeIcon icon={faBook} size="3x" style={{ opacity: 0.3 }} />
                        <Typography variant="h6" style={{ marginTop: 16 }}>
                            No subjects assigned to this section
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Add subjects to start assigning teachers
                        </Typography>
                    </Box>
                ) : (
                    <Box>
                        {subjectTeacherPairs.map((pair) => (
                            <Card 
                                key={pair.subjectId}
                                className={pair.teacherId ? classes.assignedCard : classes.unassignedCard}
                            >
                                <CardContent>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} sm={4}>
                                            <Box className={classes.subjectHeader}>
                                                <SchoolIcon style={{ marginRight: 8 }} />
                                                <Typography variant="h6">
                                                    {pair.subjectName}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        
                                        <Grid item xs={12} sm={6}>
                                            <FormControl variant="outlined" className={classes.teacherSelect} fullWidth>
                                                <InputLabel>Assign Teacher</InputLabel>
                                                <Select
                                                    value={pair.teacherId || ''}
                                                    onChange={(e) => handleTeacherAssignment(pair.subjectId, e.target.value)}
                                                    label="Assign Teacher"
                                                    startAdornment={<PersonIcon style={{ marginRight: 8 }} />}
                                                >
                                                    <MenuItem value="">
                                                        <em>No teacher assigned</em>
                                                    </MenuItem>
                                                    {allTeachers.map((teacher) => (
                                                        <MenuItem key={teacher._id} value={teacher._id}>
                                                            {teacher.first_name} {teacher.last_name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        
                                        <Grid item xs={12} sm={2}>
                                            <Tooltip title="Remove Subject">
                                                <IconButton
                                                    color="secondary"
                                                    onClick={() => handleRemoveSubject(pair.subjectId)}
                                                    size="small"
                                                >
                                                    <RemoveIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Grid>
                                    </Grid>

                                    {pair.teacherId && (
                                        <Box mt={1}>
                                            <Chip
                                                icon={<FontAwesomeIcon icon={faChalkboardTeacher} />}
                                                label={`Assigned to: ${pair.teacherName}`}
                                                color="primary"
                                                variant="outlined"
                                                size="small"
                                            />
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                )}

                {/* Add New Subject Section */}
                {availableSubjects.length > 0 && (
                    <Box className={classes.addSubjectSection}>
                        <Typography variant="h6" gutterBottom>
                            Add New Subject
                        </Typography>
                        
                        <Box display="flex" gap={2} alignItems="center" justifyContent="center">
                            <FormControl variant="outlined" style={{ minWidth: 200 }}>
                                <InputLabel>Select Subject</InputLabel>
                                <Select
                                    value={newSubjectId}
                                    onChange={(e) => setNewSubjectId(e.target.value)}
                                    label="Select Subject"
                                >
                                    {availableSubjects.map((subject) => (
                                        <MenuItem key={subject._id} value={subject._id}>
                                            {subject.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon />}
                                onClick={handleAddSubject}
                                disabled={!newSubjectId}
                            >
                                Add Subject
                            </Button>
                        </Box>
                    </Box>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} disabled={saving}>
                    Cancel
                </Button>
                {hasChanges && (
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}

export default SubjectTeacherManagement;