import React from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import WarningRoundedIcon from "@material-ui/icons/WarningRounded";
import { makeStyles, withStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "6.25rem 3rem"
  },
  icon: {
    fontSize: 96
  },
  title: {
    fontSize: "3.75rem",
    fontWeight: "bold"
  },
  content: {
    fontSize: "1rem",
    textAlign: "center"
  },
  btnPadding: {
    padding: "0.55rem 1.21rem"
  },
  cancel: {
    borderTop: "0.971px solid #E5E5E5",
    borderBottom: "3.884px solid #E5E5E5",
    borderLeft: "0.971px solid #E5E5E5",
    borderRight: "0.971px solid #E5E5E5" 
  },
  delete: {
    background: "#FF2525",
    color: "#FFF",
    borderTop: "0.971px solid #D90000",
    borderBottom: "3.884px solid #D90000",
    borderLeft: "0.971px solid #D90000",
    borderRight: "0.971px solid #D90000",
    "&:hover": {
      backgroundColor: "#D90000", // Light grey background on hover
      boxShadow: "none", // No shadow on hover to give a pressed effect
    }, 
  }
}));

export default function AlertDialog(props) {
  const { open, buttonText, handleClose, handleAction } = props;
  const classes = useStyles();

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box className={classes.root}>
          <WarningRoundedIcon color="error" className={classes.icon}></WarningRoundedIcon>
          <DialogTitle id="alert-dialog-title" disableTypography={true} className={classes.title}>Are you sure?</DialogTitle>
          <DialogContent className={classes.content}>{props.children}</DialogContent>
          <DialogActions>
            <Button className={classes.cancel} classes={{outlined: classes.btnPadding}} color="secondary" variant="outlined" disableRipple={true} onClick={handleClose}>
              Cancel
            </Button>
            <Button className={classes.delete} classes={{text: classes.btnPadding}} disableRipple={true} onClick={handleAction} autoFocus>
              {buttonText}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </div>
  );
}
