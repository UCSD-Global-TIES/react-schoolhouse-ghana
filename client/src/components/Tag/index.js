import React from 'react';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
    text: {
      fontFamily: 'Nunito',
      fontSize: '1rem',
      fontStyle: 'normal',
      fontWeight: 500,
      lineHeight: 'normal',
      textTransform: 'uppercase',
    },
    tag: {
      display: 'flex',
      padding: '0rem 0.6875rem',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '0.25rem',
      width: 'fit-content',
      margin: '0.5rem',
    }
  });



function Tag(props) {
    const classes = useStyles();
    const backgroundColor = {
        'blue' : '#2584FF',
        'green' : '#58CC02',
        'grey' : '#E5E5E5',
    }
    const textColor = {
        'blue' : '#FFFFFF',
        'green' : '#FFFFFF',
        'grey' : '#4B4B4B',
    }
    return (
        <div className={classes.tag} style={{ backgroundColor: backgroundColor[props.color], color: textColor[props.color] }}>
            <p className={classes.text}>{props.label}</p>
        </div>
    );
}

export default Tag;