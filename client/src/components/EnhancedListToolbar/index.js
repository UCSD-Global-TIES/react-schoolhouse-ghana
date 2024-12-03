import React from "react";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { Button } from "@material-ui/core";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
import banner from "../../assets/banner.png";

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    marginBottom: "2.6rem",
    justifyContent: "space-between",
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
  padding: {
    padding: "0.56rem 1.25rem",
  },
  imageContainer: {
    position: "relative",
    top: 0,
    right: 0,
    width: "115%",
    height: "110%",
    marginTop: "-7%",
    marginLeft: "-8%",
    marginBottom: "5rem",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
}));

const EnhancedListToolbar = (props) => {
  const classes = useToolbarStyles();
  const { user, numSelected, handleCreate, handleDelete, handleUpdate, buttonClass, title } =
    props;
    console.log("User in EnhancedListToolbar:", user);

  return (
    <div>
      {title === "Announcement" && (
        <div className={classes.imageContainer}>
          <img src={banner} alt="Description" className={classes.image} />
        </div>
      )}
      <Toolbar
        className={clsx(classes.root, {
          [classes.highlight]: numSelected > 0,
        })}
        disableGutters
      >
        {numSelected > 0 ? (
          <Typography className={classes.title} color="inherit" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography variant="h1" id="tableTitle">
            Schoolwide Announcements
          </Typography>
        )}
        {user.type === "Admin" && numSelected === 1 && (
          <Tooltip title="Edit">
            <IconButton onClick={handleUpdate} aria-label="edit">
              <EditIcon />
            </IconButton>
          </Tooltip>
        )}

        {user.type === "Admin" && numSelected > 0 && (
          <Tooltip title="Delete">
            <IconButton onClick={handleDelete} aria-label="delete">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}

        {user.type === "Admin" && (
          <Button
            onClick={handleCreate}
            className={buttonClass + " " + classes.createBtn}
            classes={{ text: classes.padding }}
          >
            + {title}
          </Button>
        )}
      </Toolbar>
    </div>
  );
};

export default EnhancedListToolbar;
