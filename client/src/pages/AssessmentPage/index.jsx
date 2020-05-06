import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    root: {
      display: 'flex',
      margin: '30px'
    },
  });

const AssessmentPage = (props) => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <h1>Ability to take quiz coming soon!</h1>
        </div>
    )
};

export default AssessmentPage;