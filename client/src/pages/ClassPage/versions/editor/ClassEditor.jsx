import React from "react";
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import "../../../../utils/flowHeaders.min.css";
import "./main.css";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullhorn } from '@fortawesome/free-solid-svg-icons'
import Fab from "@material-ui/core/Fab";

const announcements = [
  {
    author: "Author 1",
    content: "Content",
    date: "Jan 1, 2019",
    _id: "1"
  },
  {
    author: "Author 2",
    content: "Content",
    date: "Jan 1, 2019",
    _id: "2"
  },
  {
    author: "Author 3",
    content: "Content",
    date: "Jan 1, 2019",
    _id: "3"
  },
  {
    author: "Author 4",
    content: "Content",
    date: "Jan 1, 2019",
    _id: "4"
  }
];

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  pageSection: {
    marginTop: '4em'
  }
}));

function ClassEditor(props) {
  const classes = useStyles();
  const [checked, setChecked] = useState([0]);
  const [isDelete, setDelete] = useState([false]);
  const [isUpdate, setUpdate] = useState([false]);

  const handleToggle = value => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];


    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    if (newChecked.length == 1) {
      setDelete(false);
      setUpdate(false);
    }
    else if (newChecked.length === 2) {
      setDelete(true);
      setUpdate(true);
    }
    else if (newChecked.length > 2) {
      setDelete(true);
      setUpdate(false);
    }
  };


  return (
    <div style={{ display: "flex", width: "100%", height: "100vh" }}>
      <div>announcements</div>
      <section className={classes.pageSection}>
        {isDelete == true &&
          <Fab
            variant="extended"
            onClick={console.log("delete")}>Delete</Fab>
        }
        {isUpdate == true &&
          <Fab
            variant="extended"
            onClick={console.log("Update")}>Update</Fab>
        }
        <Fab
          variant="extended"
          onClick={console.log("Add")}>Add</Fab>
        <div style={{ margin: "auto" }}>
          <List className={classes.root}>
            {announcements.map(announcement => {
              const labelId = `checkbox-list-label-${announcement._id}`;

              return (
                <ListItem key={announcement._id} role={undefined} dense button onClick={handleToggle(announcement._id)}>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checked.indexOf(announcement._id) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={announcement.date} />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="comments">
                      <FontAwesomeIcon icon={faBullhorn} size="sm" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        </div>
      </section>
    </div>
  );
}

export default ClassEditor;
