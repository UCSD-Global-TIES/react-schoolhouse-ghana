import React, { useState, useEffect } from 'react';
import { Typography, Box, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ClassCard from '../ClassCard';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    gradeSection: {
        marginBottom: theme.spacing(4),
    },
    gradeTitle: {
        marginBottom: theme.spacing(2),
        color: '#333',
        fontWeight: 'bold',
    },
    classContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing(2),
        alignItems: 'flex-start',
    },
    clickableCard: {
        cursor: 'pointer',
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.12)',
            transition: 'all 0.2s ease-in-out',
        }
    }
}));

function GradeLevelListing({ 
    documents, 
    grStatus, 
    primary, 
    secondary, 
    handleDocument, 
    handleSelect, 
    teacherOptions 
}) {
    const classes = useStyles();
    const history = useHistory();
    const [groupedGrades, setGroupedGrades] = useState({});

    // Group grades by level and status
    useEffect(() => {
        const grouped = {};
        
        documents.forEach(document => {
            const level = document.level;
            if (!grouped[level]) {
                grouped[level] = {
                    active: [],
                    unpublished: [],
                    archived: []
                };
            }
            
            const status = grStatus(document).replace(/[()]/g, ''); // Remove parentheses
            if (grouped[level][status]) {
                grouped[level][status].push(document);
            }
        });
        
        setGroupedGrades(grouped);
    }, [documents, grStatus]);

    const getTagColor = (status) => {
        switch (status) {
            case 'active': return '#4CAF50';
            case 'unpublished': return '#FF9800'; 
            case 'archived': return '#757575';
            default: return '#2196F3';
        }
    };

    const getTagLabel = (status, document) => {
        if (status === 'active') {
            const date = new Date(document.createdAt);
            const year = date.getFullYear();
            return `${year}-${year + 1}`;
        }
        return status;
    };

    // Sort grade levels numerically
    const sortedLevels = Object.keys(groupedGrades).sort((a, b) => parseInt(a) - parseInt(b));

    return (
        <Box>
            {sortedLevels.map(level => {
                const gradeData = groupedGrades[level];
                const hasAnyGrades = gradeData.active.length > 0 || 
                                   gradeData.unpublished.length > 0 || 
                                   gradeData.archived.length > 0;

                if (!hasAnyGrades) return null;

                return (
                    <Box key={level} className={classes.gradeSection}>
                        <Typography variant="h4" className={classes.gradeTitle}>
                            Grade {level}
                        </Typography>
                        
                        <Box className={classes.classContainer}>
                            {/* Active sections first */}
                            {gradeData.active.map(document => {
                                // Extract first teacher from subjectTeacherAssignments
                                const firstAssignment = document.subjectTeacherAssignments?.find(a => a.teacher);
                                const teacherId = firstAssignment?.teacher;
                                const teacher = teacherId ? teacherOptions.find(t => t._id === teacherId) : null;
                                const teacherName = teacher ? `${teacher.last_name}` : '';
                                
                                const date = new Date(document.createdAt);
                                const year = date.getFullYear();
                                const yearLabel = 'YR' + String(year).slice(-2) + '-' + (String(year+1).slice(-2));
                                
                                const gradeLabel = teacher ? secondary(document) : primary(document);
                                
                                return (
                                    <Box 
                                        key={document._id}
                                        className={classes.clickableCard}
                                    >
                                        <ClassCard
                                            name={`${teacherName} ${gradeLabel}`.trim()}
                                            secondLine={yearLabel}
                                            tagColor={getTagColor('active')}
                                            tagLabel={getTagLabel('active', document)}
                                            image=""
                                            handleDocument={handleDocument}
                                            handleSelect={handleSelect}
                                            document={document}
                                            editable={true}
                                        />
                                    </Box>
                                );
                            })}
                            
                            {/* Unpublished sections */}
                            {gradeData.unpublished.map(document => {
                                // Extract first teacher from subjectTeacherAssignments
                                const firstAssignment = document.subjectTeacherAssignments?.find(a => a.teacher);
                                const teacherId = firstAssignment?.teacher;
                                const teacher = teacherId ? teacherOptions.find(t => t._id === teacherId) : null;
                                const teacherName = teacher ? `${teacher.last_name}` : '';
                                
                                const date = new Date(document.createdAt);
                                const year = date.getFullYear();
                                const yearLabel = 'YR' + String(year).slice(-2) + '-' + (String(year+1).slice(-2));
                                
                                const gradeLabel = teacher ? secondary(document) : primary(document);
                                
                                return (
                                    <Box 
                                        key={document._id}
                                        className={classes.clickableCard}
                                    >
                                        <ClassCard
                                            name={`${teacherName} ${gradeLabel}`.trim()}
                                            secondLine={yearLabel}
                                            tagColor={getTagColor('unpublished')}
                                            tagLabel={getTagLabel('unpublished', document)}
                                            image=""
                                            handleDocument={handleDocument}
                                            handleSelect={handleSelect}
                                            document={document}
                                            editable={true}
                                        />
                                    </Box>
                                );
                            })}
                            
                            {/* Archived sections */}
                            {gradeData.archived.map(document => {
                                // Extract first teacher from subjectTeacherAssignments
                                const firstAssignment = document.subjectTeacherAssignments?.find(a => a.teacher);
                                const teacherId = firstAssignment?.teacher;
                                const teacher = teacherId ? teacherOptions.find(t => t._id === teacherId) : null;
                                const teacherName = teacher ? `${teacher.last_name}` : '';
                                
                                const date = new Date(document.createdAt);
                                const year = date.getFullYear();
                                const yearLabel = 'YR' + String(year).slice(-2) + '-' + (String(year+1).slice(-2));
                                
                                const gradeLabel = teacher ? secondary(document) : primary(document);
                                
                                return (
                                    <Box 
                                        key={document._id}
                                        className={classes.clickableCard}
                                    >
                                        <ClassCard
                                            name={`${teacherName} ${gradeLabel}`.trim()}
                                            secondLine={yearLabel}
                                            tagColor={getTagColor('archived')}
                                            tagLabel={getTagLabel('archived', document)}
                                            image=""
                                            handleDocument={handleDocument}
                                            handleSelect={handleSelect}
                                            document={document}
                                            editable={true}
                                        />
                                    </Box>
                                );
                            })}
                        </Box>
                    </Box>
                );
            })}
        </Box>
    );
}

export default GradeLevelListing;