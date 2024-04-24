import React from 'react';
import ClassCard from '../ClassCard';
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    classContainer: { 
        display: "flex",
        gap: "2rem",
        overflowX: "auto",
        whiteSpace: "nowrap",
    }
}));

function EnrolledClasses(props) {
    const classes = useStyles();
    const subjects = props.subjects;
    const tagMap = {
        'archived': 'grey',
        'unpublished': 'blue',
        'active': 'green',
    }
    return (
        <>
            {
            subjects.length > 0 ? (
                <>
                    <div style={{marginBottom: '1rem'}}>
                        <Typography variant="h2">ENROLLED CLASSES</Typography>
                    </div>
                    
                    <div className={classes.classContainer}>
                    
                    {subjects.map((subject) => {
                        const date = new Date(subject.createdAt);
                        const year = date.getFullYear();

                        return (
                            <ClassCard name={subject.name} tagColor={'green'} tagLabel={`${year}-${year + 1}`} image=''/>
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