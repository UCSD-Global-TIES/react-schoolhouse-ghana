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
                    
                    {subjects.map((subject) => {
                        const date = new Date(subject.createdAt);
                        const year = date.getFullYear();

                        const yearLabel = 'YR' + String(year).slice(-2) + '-' + (String(year+1).slice(-2));

                        let label = '';
                        if(status === 'active'){
                            label = year + '-' + (year + 1);
                        } else {
                            label = status;
                        }
                        return (
                            <Link to={`/subject/${subject._id}`} key={subject._id} style={{ textDecoration: 'none' }}>
                                <ClassCard name = {`${subject.name} ${gradeLabel}`} secondLine = {yearLabel} tagColor={tagMap[status]} tagLabel={label} image='' editable={editable} />
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