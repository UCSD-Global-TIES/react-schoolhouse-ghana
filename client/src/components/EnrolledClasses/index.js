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
    const { subjects, status} = props;
    const classes = useStyles();
    
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
                        let label = '';
                        if(status === 'active'){
                            label = year + '-' + (year + 1);
                        } else {
                            label = status;
                        }
                        return (
                            <ClassCard name={subject.name} tagColor={tagMap[status]} tagLabel={label} image=''/>
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