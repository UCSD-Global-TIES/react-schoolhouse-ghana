import React from "react";
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
import CommentIcon from '@material-ui/icons/Comment';
import { Grid } from "@material-ui/core";

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
}));

function ClassEditor(props) {
  const classes = useStyles();
  const [checked, setChecked] = React.useState([0]);

  const handleToggle = value => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };


  return (
    <div style={{ display: "flex", width: "100%", height: "100vh" }}>
      <div>announcements</div>
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
                    <CommentIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      </div>
    </div>
  );
}

export default ClassEditor;
