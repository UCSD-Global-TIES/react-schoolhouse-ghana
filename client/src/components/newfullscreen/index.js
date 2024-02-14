import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import "../../utils/flowHeaders.min.css";
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'fixed', // Or 'absolute' if you want it to be positioned relative to its closest positioned ancestor
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'auto', // Scrollable if the content exceeds the viewport
    zIndex: 1000, // Ensure it's above other content
    backgroundColor: '#fff', // Background color for the full-screen component
  },
  appBar: {
    position: 'relative', // Adjust based on layout needs
    background: '#FE951D',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  content: {
    marginTop: theme.spacing(8), // Adjust based on AppBar height
    padding: theme.spacing(3),
  },
}));

export default function FullScreenComponent(props) {
  const classes = useStyles();

  return (

    <div className={classes.root}>
        open={props.open}
        onClose={props.handleClose}
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={props.handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={clsx(classes.title, "flow-text")}>
            {props.type}
          </Typography>
          <Button disabled={props.buttonDisabled} color="inherit" onClick={props.action}>
            {props.buttonText}
          </Button>
        </Toolbar>
      </AppBar>
      <div className={classes.content}>
        {props.children}
      </div>
    </div>
  );
}
