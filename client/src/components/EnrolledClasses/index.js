import React from 'react';
import ClassCard from '../ClassCard';
import SearchBar from '../SearchBar/SearchBar';

function EnrolledClasses() {
    return (
        <>
            <div>
                <h1>ENROLLED CLASSES</h1>
                <SearchBar placeholder='classes' function='' value=''/>
            </div>
            
            <div className={classes.classContainer}>
            {
                // TO DO: update to subject options item.level for gradeOptions
                textFields.map((item) => {
                    return(
                        <ClassCard name={item.name} image=''/>
                    )
                })
                
            }
            </div>
        </>
    );
};

export default EnrolledClasses;