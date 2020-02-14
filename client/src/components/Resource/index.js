import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";

const useStyles = makeStyles({
  card: {
    minWidth: 275,
    display: "flex"
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
  content: {
    flex: "1 0 auto"
  }
});

/*SimpleCard https://material-ui.com/components/cards/ */

export default function SimpleResource(data) {
  const classes = useStyles();
  // const bull = <span className={classes.bullet}>•</span>;
  const resource = data.resource;

  return (
    <Card className={classes.card}>
      <CardContent className={classes.content}>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          {resource.date}
        </Typography>
        <Typography variant="h5" component="h2">
          {resource.title}
        </Typography>

        <Typography variant="body2" component="p">
          {resource.content}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="large">
          <OpenInNewIcon color="primary" fontSize="large" />
        </Button>{" "}
        {/*onclick open resource*/}
      </CardActions>
    </Card>
  );
}
