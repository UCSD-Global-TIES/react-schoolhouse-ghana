import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import "../../utils/flowHeaders.min.css"
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  // appBar: {
  // },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  dialogContent: {
    marginTop: "4rem",
    padding: "0.5rem",
    margin: "0",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog(props) {
  const classes = useStyles();

  return (
    <div>
      {/* <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open full-screen dialog
      </Button> */}


<Dialog
  open={props.open}
  onClose={props.handleClose}
  TransitionComponent={Transition}
  PaperProps={{
    style: {
      position: 'absolute',
      right: 0,
      margin: '0',
      maxHeight: '100%',
      width: '85vw', // Example: Set dialog width to 60% of the viewport width
      maxWidth: 'none', // Override the default maxWidth to allow full specified width
    }
  }}
>
  <AppBar className={classes.appBar} style={{ background: '#FE951D', width: '100%' }}>
    <Toolbar>
      <IconButton edge="start" color="inherit" onClick={props.handleClose} aria-label="close">
        <CloseIcon />
      </IconButton>
      <Typography variant="h6" className={clsx(classes.title, "flow-text")}>
        {props.type}
      </Typography>
      <Button disabled={props.buttonDisabled} autoFocus color="inherit" onClick={props.action}>
        {props.buttonText}
      </Button>
    </Toolbar>
  </AppBar>
  <div className={classes.dialogContent}>
    {props.children}
  </div>
</Dialog>


    </div>
  );
}