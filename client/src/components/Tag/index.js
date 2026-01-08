import React from 'react';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
    text: {
      fontFamily: 'Nunito',
      fontSize: "0.75rem",
      fontStyle: 'normal',
      fontWeight: 500,
      lineHeight: 'normal',
      textTransform: 'uppercase',
    },
    tag: {
      display: 'flex',
      padding: '0rem 0.5rem',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '0.25rem',
      width: 'fit-content',
    }
  });



function Tag(props) {
    const classes = useStyles();
    const backgroundColor = {
        'blue' : '#2584FF',
        'green' : '#58CC02',
        'grey' : '#E5E5E5',
        'yellow' : '#FFC800'
    }
    const textColor = {
        'blue' : '#FFFFFF',
        'green' : '#FFFFFF',
        'grey' : '#4B4B4B',
        'yellow' : '#4B4B4B',
    }
    return (
        <div className={classes.tag} style={{ backgroundColor: backgroundColor[props.color], color: textColor[props.color] }}>
            <p className={classes.text}>{props.label}</p>
        </div>
    );
}

export default Tag;