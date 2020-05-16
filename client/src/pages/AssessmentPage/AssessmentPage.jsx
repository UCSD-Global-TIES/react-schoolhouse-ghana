import React from "react";
import {
  Typography,
  CssBaseline,
  Button,
  TextField,
  Box
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AssessmentForm from "../../components/AssessmentMCForm";
const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  question: {
    width: "75vw",
    maxWidth: "300px"
  }
}));
//TODO: Import the question from the database and update the state values

function AssessmentPage(props) {
  const classes = useStyles();
  const handleSubmit = () => {
    //TODO: store answers
  };
  const questions = [
    {
      question: "This is the first question",
      type: "mc",
      answers: ["Choice 0", "Choice 1", "Choice 2", "Choice 3", "Choice 4"],
      number: "1"
    },
    {
      question: "This is the second question",
      type: "sa",
      answers: [],
      number: "2"
    },
    {
      question: "This is the third question",
      type: "mc",
      answers: ["Choice 0", "Choice 1", "Choice 2", "Choice 3", "Choice 4"],
      number: "3"
    },
    {
      question: "This is the fourth question",
      type: "mc",
      answers: ["Choice 0", "Choice 1", "Choice 2", "Choice 3", "Choice 4"],
      number: "4"
    },
    {
      question: "This is the fifth question",
      type: "mc",
      answers: ["Choice 0", "Choice 1", "Choice 2", "Choice 3", "Choice 4"],
      number: "5"
    }
  ];
  var states = {};

  return (
    <React.Fragment>
      <CssBaseline />

      <div className={classes.root}>
        <div style={{ display: "flex", width: "90%", height: "75vh" }}>
          <div style={{ margin: "auto" }}>
            {questions.map(function(question, i) {
              states = question;
              return (
                <div className={classes.question}>
                  <div
                    style={{ display: "flex", width: "100%", margin: "150px" }}
                  >
                    <div style={{ margin: "auto" }}>
                      <Box
                        display="flex"
                        width={500}
                        height={0}
                        alignItems="center"
                        justifyContent="left"
                        anchor="center"
                      >
                        <Typography variant="h5" gutterBottom>
                          {states.number}. {states.question}
                        </Typography>
                      </Box>
                      <Box
                        display={states.type === "sa" ? "none" : "flex"}
                        width={500}
                        height={100}
                        alignItems="center"
                        justifyContent="center"
                        anchor="center"
                      >
                        <AssessmentForm answers={states.answers} />
                      </Box>
                      <Box
                        display="flex"
                        width={500}
                        height={100}
                        alignItems="center"
                        justifyContent="center"
                        anchor="center"
                      >
                        <TextField
                          id="outlined-basic"
                          label={
                            states.type === "sa"
                              ? "Answer"
                              : "Explain (optional)"
                          }
                          variant="outlined"
                          anchor="center"
                          size="small"
                          fullWidth
                          style={{ margin: 8 }}
                          margin="normal"
                          InputLabelProps={{
                            shrink: true
                          }}
                        />
                      </Box>
                    </div>
                  </div>
                </div>
              );
            })}
            <Box
              display="flex"
              width={650}
              height={100}
              alignItems="center"
              justifyContent="flex-end"
              anchor="right"
            >
              <Button
                variant="contained"
                color="primary"
                bottom="100%"
                onClick={() => handleSubmit}
              >
                Submit
              </Button>
            </Box>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default AssessmentPage;
