import React from 'react';
import ClassCard from '../ClassCard';
import { Link } from 'react-router-dom';
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    classContainer: { 
        display: "flex",
        gap: "2rem",
        overflowX: "auto",
        whiteSpace: "nowrap",
        marginTop:'.5rem',
        width: '100%',
    }
}));

function EnrolledClasses(props) {
    const { subjects, status, title, editable, gradeLabel} = props;
    const classes = useStyles();
    
    const tagMap = {
        'archived': 'grey',
        'unpublished': 'blue',
        'active': 'green',
    }
    return (
        <>
            {
            subjects && subjects.length > 0 ? (
                <>
                    <div style={{marginBottom: '1rem'}}>
                        <Typography variant="h2">{title}</Typography>
                    </div>
                    
                    <div className={classes.classContainer}>
                    
                    {subjects.map((subject, index) => {
                        const date = new Date(subject.createdAt);
                        const year = date.getFullYear();

                        const yearLabel = 'YR' + String(year).slice(-2) + '-' + (String(year+1).slice(-2));

                        let label = '';
                        if(status === 'active'){
                            label = year + '-' + (year + 1);
                        } else {
                            label = status;
                        }
                        
                        // Use displayName if available (includes grade-section), otherwise construct it
                        let displayName = subject.name;
                        if (subject.displayName) {
                            displayName = subject.displayName;
                        } else if (subject.gradeLevel) {
                            displayName = `Grade ${subject.gradeLevel}${subject.gradeSection || 'A'} ${subject.name}`;
                        }
                        
                        // Create unique key to avoid duplicate key warnings when same subject appears in multiple grades
                        const uniqueKey = subject.gradeId ? `${subject._id}-${subject.gradeId}` : `${subject._id}-${index}`;
                        
                        // Use the composite ID from backend (_id already contains subjectId_gradeId)
                        // and add grade info as query params for display
                        const subjectUrl = subject.gradeLevel && subject.gradeSection 
                            ? `/subject/${subject._id}?gradeLevel=${subject.gradeLevel}&gradeSection=${subject.gradeSection}`
                            : `/subject/${subject._id}`;
                        
                        return (
                            <Link to={subjectUrl} key={uniqueKey} style={{ textDecoration: 'none' }}>
                                <ClassCard name = {`${displayName} ${gradeLabel}`} secondLine = {yearLabel} tagColor={tagMap[status]} tagLabel={label} image='' editable={editable} />
                            </Link>
                        );
                    })}
                    </div>
                </>
            ) : (
                <></>
            ) }      
            
        </>
    );
};

export default EnrolledClasses;