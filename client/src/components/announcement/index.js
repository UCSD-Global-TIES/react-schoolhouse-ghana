import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";


const useStyles = makeStyles({
  card: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  info: {
    display: "flex",
    justifyContent: "space-between"
  }
});

// *SimpleCard https://material-ui.com/components/cards/ */

export default function AnnouncementView(data) {
  const classes = useStyles();
  // const bull = <span className={classes.bullet}>•</span>;
  const announcement = data.announcement;

  return (
    <Card className={classes.card}>
      <CardContent>
        <div className={classes.info}>
          <Typography variant="body2" component="p" gutterBottom>
            {announcement.author}
          </Typography>
          <Typography
            className={classes.title}
            color="textSecondary"
            gutterBottom
          >
            {announcement.date}
          </Typography>
        </div>
        <Divider />
        <Typography variant="body1" component="p">
          {announcement.content}
        </Typography>
      </CardContent>
    </Card>
  );
}
