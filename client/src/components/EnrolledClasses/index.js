import React from 'react';
import ClassCard from '../ClassCard';
import SearchBar from '../SearchBar/SearchBar';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    classContainer: { 
        display: "flex",
        gap: "2rem",
        overflowX: "auto",
        whiteSpace: "nowrap",
    }
}));

function EnrolledClasses() {
    const classes = useStyles();
    const dummyClasses = [
        {
            name: 'Class 1',
            image: 'books',
            tagLabel: '2023-2024',
        },
        {
            name: 'Class 2',
            image: 'books',
            tagLabel: '2023-2024',
        },
        {
            name: 'Class 3',
            image: 'books',
            tagLabel: 'archived',
        },
        {
            name: 'Class 4',
            image: 'books',
            tagLabel: 'unpublished',
        },
        {
            name: 'Class 5',
            image: 'books',
            tagLabel: 'archived',
        },
        {
            name: 'Class 6',
            image: 'books',
            tagLabel: '2023-2024',
        },
    ];
    const tagMap = {
        'archived': 'grey',
        'unpublished': 'blue',
        '2023-2024': 'green',
    }
    return (
        <>
            <div>
                <h1>ENROLLED CLASSES</h1>
                <SearchBar placeholder='classes' function='' value=''/>
                
            </div>
            
            <div className={classes.classContainer}>
            {
                // TO DO: update to subject options item.level for gradeOptions
                dummyClasses.map((item) => {
                    return(
                        <ClassCard name={item.name} tagColor={tagMap[item.tagLabel]} tagLabel={item.tagLabel} image=''/>
                    )
                })
                
            }
            </div>
        </>
    );
};

export default EnrolledClasses;