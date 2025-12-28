import React, { useEffect, useState } from "react";
import { 
    TextField, 
    Box, 
    Typography, 
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
    Checkbox,
    FormControlLabel,
    Paper
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { ExpandMore, ExpandLess } from '@material-ui/icons';
import { parseTime } from '../../utils/misc';
import DocumentPicker from "../DocumentPicker"
import ConfirmDialog from "../ConfirmDialog";
import SectionDetail from "../SectionDetail";

import "../../utils/flowHeaders.min.css";
import API from "../../utils/API";
import { faChalkboardTeacher, faAppleAlt, faUserGraduate } from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles(theme => ({
    root: {
        
        width: "100%",
    },
    field: {
        margin: "1rem 0px"
    },
    vc: {
        // //maxWidth: "500px",
        // width: "90%",
        // margin: "auto"
    },
    margin: {
        marginBottom: "2rem"
     },
     btn: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        // gap: "0.625rem",
        height: "3.00rem",
        padding: "0.5625rem 1.25rem",
        flexShrink: "0",
        fontSize: "1.75rem",
        borderRadius: "1.5rem",
        fontFamily: "Nunito",
        borderTop: "1px solid #005FD9",
        borderRight: "1px solid #005FD9",
        borderBottom: "4px solid #005FD9",
        borderLeft: "1px solid #005FD9",
        background: "#2584FF",
        color: "#FFF",
        // margin: "1rem",
      },
}));

const disabledMsg = `This field will be populated after grade creation.`

const textFields = [
    {
        name: "level",
        label: "Grade Level",
        helper: "This is the numerical level of this grade.",
        createOnly: true,
        isNumber: true,
        required: true
    },
    {
        name: "section",
        label: "Section",
        helper: "Section letter for this grade (A, B, C, etc.). Must be a single uppercase letter.",
        createOnly: true,
        required: true,
        maxLength: 1,
        pattern: /^[A-Z]$/,
        patternMessage: "Section must be a single uppercase letter (A, B, C, etc.)"
    },
    {
        name: "createdAt",
        label: "Created On",
        isDate: true,
        disabled: true,
        helper: "This is the date this grade was created."
    },
    {
        name: "updatedAt",
        label: "Last Updated",
        isDate: true,
        disabled: true,
        helper: "This is the date this grade was last updated."
    },

]
// Private field is special use case

const MIN_GRADE = 1;
function GradesForm(props) {
    const classes = useStyles();
    const [subjectOptions, setSubjectOptions] = useState([]);

    // Grade Section Creation Wizard State (simplified for new grade creation)
    const [wizardLevel, setWizardLevel] = useState(1);
    const [wizardSectionCount, setWizardSectionCount] = useState(1);
    const [wizardSelectedSubjects, setWizardSelectedSubjects] = useState([]);
    const [isCreating, setIsCreating] = useState(false);

    // Section Detail State
    const [currentSection, setCurrentSection] = useState(props.document.section || 'A');


    const rerouteSubjects = () => {
        props.history.push({
            pathname: `/edit/subjects`,
        })
    }

    // Grade Section Wizard Functions
    const handleSubjectToggle = (subjectId) => {
        setWizardSelectedSubjects(prev => 
            prev.includes(subjectId) 
                ? prev.filter(id => id !== subjectId)
                : [...prev, subjectId]
        );
    };

    const generateSectionLetters = (count) => {
        return Array.from({ length: count }, (_, i) => String.fromCharCode(65 + i)); // A, B, C, etc.
    };

    // Simplified grade creation for wizard
    const handlePublishGrades = async () => {
        if (wizardSelectedSubjects.length === 0) {
            alert('Please select at least one subject.');
            return;
        }

        setIsCreating(true);
        
        try {
            const sectionLetters = generateSectionLetters(wizardSectionCount);
            console.log(`🔹 Creating ${sectionLetters.length} sections for Grade ${wizardLevel}:`, sectionLetters);
            let successCount = 0;
            const errors = [];
            
            for (let i = 0; i < sectionLetters.length; i++) {
                const sectionLetter = sectionLetters[i];
                
                try {
                    // Create completely fresh grade data object for each iteration
                    const levelNum = parseInt(wizardLevel);
                    const subjectsArray = Array.isArray(wizardSelectedSubjects) ? [...wizardSelectedSubjects] : [];
                    
                    // Create subjectTeacherAssignments with subjects but no teachers initially
                    const subjectTeacherAssignments = subjectsArray.map(subjectId => ({
                        subject: subjectId,
                        teacher: null
                    }));
                    
                    const gradeData = {
                        level: levelNum,
                        section: sectionLetter,
                        subjectTeacherAssignments: subjectTeacherAssignments,
                        students: [],
                        status: 'active'
                    };

                    console.log(`🔹 Creating Grade ${levelNum}${sectionLetter} with data:`, JSON.stringify(gradeData, null, 2));
                    
                    const response = await API.addGrade(gradeData, props.user.key);
                    console.log(`✅ Created Grade ${levelNum}${sectionLetter}:`, response.data);
                    successCount++;
                    
                    // Add small delay between requests to avoid race conditions
                    if (i < sectionLetters.length - 1) {
                        await new Promise(resolve => setTimeout(resolve, 200));
                    }
                    
                } catch (sectionError) {
                    console.error(`❌ Error creating Grade ${wizardLevel}${sectionLetter}:`, sectionError.response?.data || sectionError.message);
                    const errorMsg = sectionError.response?.data?.error || sectionError.message || 'Unknown error';
                    errors.push(`Section ${sectionLetter}: ${errorMsg}`);
                }
            }

            if (successCount === sectionLetters.length) {
                alert(`✅ Successfully created Grade ${wizardLevel} with ${successCount} section${successCount > 1 ? 's' : ''}!`);
                
                // Close the dialog/form
                if (props.handleClose) {
                    props.handleClose();
                }
            } else if (successCount > 0) {
                alert(`⚠️ Partially successful: Created ${successCount}/${sectionLetters.length} sections.\nErrors:\n${errors.join('\n')}`);
            } else {
                alert(`❌ Failed to create any sections.\nErrors:\n${errors.join('\n')}`);
            }
            
        } catch (error) {
            console.error('❌ Error in grade creation process:', error);
            alert('Error creating grade sections. Please try again.');
        } finally {
            setIsCreating(false);
        }
    };

    // Section Detail Handler Functions
    const handleSectionNavigation = (newSection) => {
        setCurrentSection(newSection);
        
        // Find the grade document for the new section
        // This would typically involve fetching the grade data for the new section
        // For now, we'll just update the current section
        console.log(`Switching to section ${newSection}`);
        
        // TODO: Implement section switching logic
        // This should update props.document to the new section's data
    };

    const handleEditSection = (sectionData) => {
        console.log('📝 Edit Section clicked:', sectionData);
        
        // For now, let's show what editing would do
        // In a full implementation, you would:
        // 1. Open DocumentEditor in edit mode with this section's data
        // 2. Or navigate to a different route for editing
        
        alert(`Edit functionality for Grade ${sectionData.level} Section ${sectionData.section}:\n\n` +
              `Current Status: ${sectionData.status}\n` +
              `Subject-Teacher Assignments: ${sectionData.subjectTeacherAssignments?.length || 0}\n` +
              `Students: ${sectionData.students?.length || 0}\n\n` +
              `To edit this grade, you can:\n` +
              `- Add/remove subjects and assign teachers using the subject-teacher management dialog\n` +
              `- Add/remove students using the student management dialog\n` +
              `- Toggle Active/Archive status by clicking the status chip`);
    };

    useEffect(() => {
        // Load subjects for the wizard
        API.getSubjects(props.user.key)
            .then((result) => {
                setSubjectOptions([...result.data]);
            })
            .catch(error => {
                console.error('Error loading subjects:', error);
            });
    }, [props.user.key]);



    // Set default section to 'A' for new grades
    useEffect(() => {
        if (props.isCreate && !props.document.section) {
            const event = {
                target: {
                    name: 'section',
                    value: 'A'
                }
            };
            props.handleChange(event);
        }
    }, [props.isCreate, props.document.section]);

    return (
        <div className={classes.root}>
            
            
            {/* Simplified Grade Creation Wizard */}
            {props.isCreate ? (
                <Paper elevation={2} style={{ padding: '24px', marginBottom: '20px' }}>
                    <Typography variant="h6" gutterBottom color="primary">
                        <span role="img" aria-label="books">📚</span> Create Grade Sections
                    </Typography>
                    
                    {/* Grade Level Selection */}
                    <FormControl variant="outlined" fullWidth style={{ marginBottom: '16px' }}>
                        <InputLabel>Grade Level</InputLabel>
                        <Select
                            value={wizardLevel}
                            onChange={(e) => setWizardLevel(e.target.value)}
                            label="Grade Level"
                        >
                            {[1,2,3,4,5,6,7,8,9,10,11,12].map(level => (
                                <MenuItem key={level} value={level}>Grade {level}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Section Count Selection */}
                    <FormControl variant="outlined" fullWidth style={{ marginBottom: '16px' }}>
                        <InputLabel>Number of Sections</InputLabel>
                        <Select
                            value={wizardSectionCount}
                            onChange={(e) => setWizardSectionCount(e.target.value)}
                            label="Number of Sections"
                        >
                            {[1,2,3,4,5,6].map(count => (
                                <MenuItem key={count} value={count}>
                                    {count} Section{count > 1 ? 's' : ''} ({generateSectionLetters(count).join(', ')})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Subjects Selection */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" style={{ marginBottom: '8px' }}>
                        <Typography variant="subtitle1">
                            Select Subjects:
                        </Typography>
                        <Button 
                            variant="outlined" 
                            color="primary" 
                            onClick={rerouteSubjects}
                            size="small"
                            style={{ minWidth: '120px' }}
                        >
                            + Subject
                        </Button>
                    </Box>
                    
                    {subjectOptions.length > 0 ? (
                        <Box display="flex" flexWrap="wrap" gap={1} style={{ marginBottom: '24px' }}>
                            {subjectOptions.map(subject => (
                                <Chip
                                    key={subject._id}
                                    label={subject.name}
                                    onClick={() => handleSubjectToggle(subject._id)}
                                    color={wizardSelectedSubjects.includes(subject._id) ? 'primary' : 'default'}
                                    variant={wizardSelectedSubjects.includes(subject._id) ? 'default' : 'outlined'}
                                    clickable
                                />
                            ))}
                        </Box>
                    ) : (
                        <Box style={{ 
                            marginBottom: '24px', 
                            padding: '16px', 
                            backgroundColor: '#f5f5f5', 
                            borderRadius: '4px',
                            textAlign: 'center'
                        }}>
                            <Typography variant="body2" color="textSecondary">
                                <span role="img" aria-label="warning">⚠️</span> No subjects available. Create subjects first to continue.
                            </Typography>
                        </Box>
                    )}

                    {/* Action Buttons */}
                    <Box display="flex" gap={2} justifyContent="flex-end">
                        <Button 
                            variant="outlined" 
                            onClick={() => props.handleClose && props.handleClose()}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handlePublishGrades}
                            disabled={wizardSelectedSubjects.length === 0 || isCreating}
                        >
                            {isCreating ? 'Publishing...' : `Publish Grade ${wizardLevel}`}
                        </Button>
                    </Box>
                </Paper>
            ) : (
                /* Section Detail View */
                <SectionDetail
                    gradeId={props.document._id}
                    gradeLevel={props.document.level}
                    currentSection={currentSection}
                    onSectionChange={handleSectionNavigation}
                    // Edit button removed in SectionDetail per design request
                    user={props.user}
                />
            )}
        </div>
    )
};

export default GradesForm;