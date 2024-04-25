import React from "react";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import PostAddIcon from "@material-ui/icons/PostAdd";
import EditIcon from "@material-ui/icons/Edit";
import clsx from "clsx";
import { Button } from "@material-ui/core";
import { lighten, makeStyles } from "@material-ui/core/styles";

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    marginBottom: "2.6rem",
    justifyContent: "space-between"
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          paddingLeft: theme.spacing(2),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
          paddingLeft: theme.spacing(2),
        },
  title: {
    flex: "1 1 100%",
    marginBottom: "2.6rem",
  },
  createBtn: {
    minWidth: "11.3rem",
    height: "3.5rem",
  },
}));

const EnhancedListToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected, handleCreate, handleDelete, handleUpdate, buttonClass, title } =
    props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
      disableGutters
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography variant="h1" id="tableTitle">
          {props.title}s Manager
        </Typography>
      )}

      {numSelected === 1 ? (
        <Tooltip title="Edit">
          <IconButton onClick={handleUpdate} aria-label="edit">
            <EditIcon />
          </IconButton>
        </Tooltip>
      ) : (
        ""
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={handleDelete} aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        ""
      )}
      <Button onClick={handleCreate} className={buttonClass + " " + classes.createBtn}>
        + {title}
      </Button>
    </Toolbar>
  );
};

export default EnhancedListToolbar;
