import React from 'react';
import ClassCard from '../ClassCard';
import SearchBar from '../SearchBar/SearchBar';
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
        '2023-2024': 'green',
    }
    return (
        <>
            {
            subjects.length > 0 ? (
                <>
                    <div>
                        <Typography variant="h2">ENROLLED CLASSES</Typography>
                        <SearchBar placeholder='classes' function='' value=''/>
                    </div>
                    
                    <div className={classes.classContainer}>
                        {subjects.map((subject) => (
                            <ClassCard name={subject.name} tagColor={'grey'} tagLabel={'archived'} image=''/>
                        ))}
                    </div>
                </>
            ) : (
                <></>
            ) }      
            
        </>
    );
};

export default EnrolledClasses;