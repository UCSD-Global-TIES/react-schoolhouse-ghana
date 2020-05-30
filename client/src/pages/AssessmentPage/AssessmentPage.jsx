import React, { useEffect, useState } from "react";
import {
  Typography,
  CssBaseline,
  Button,
  TextField,
  Box
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AssessmentMCForm from "../../components/AssessmentMCForm";
import AssessmentFRQForm from "../../components/AssessmentFRQForm";
import AssessmentRateForm from "../../components/AssessmentRateForm";
import API from "../../utils/API";

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

const questionType = {
  MC: 'mc',
  FRQ: 'free response',
  RATE: 'rating'
};

function AssessmentPage(props) {
  const classes = useStyles();

  const formId = props.match.params.formId;

  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    API.getAssessmentQuestions(props.user.key, formId)
      .then((questionData) => {
        setQuestions(questionData.data.questions);
        console.log("Questions");
        console.log(questionData.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const getType = (questionObj) => {
    if (!!questionObj.isFreeResponse) {
      return questionType.FRQ;
    } 

    // Must use the in operator to avoid cases where the ratingStart value is 0
    if ("ratingStart" in questionObj && "ratingEnd" in questionObj) {
      return questionType.RATE;
    }
    if (questionObj.choices.length > 0) {
      return questionType.MC;
    }
  }

  const renderCorrectComponent = (questionObj) => {
    console.log(questionObj);

    switch (questionObj.type) {
      case questionType.FRQ:
        return <AssessmentFRQForm question={questionObj} />
      case questionType.MC:
        return <AssessmentMCForm answers={questionObj.choices} />
      case questionType.RATE:
        return <AssessmentRateForm question={questionObj} />
      default:
        return <></>
    }
  }

  const handleSubmit = async (states) => {
    //TODO: store answers
    try {
      const value = await API.postResponse(props.user.key, states);
    } catch (e) {
      window.alert(e);
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />

      <div className={classes.root}>
        <div style={{ display: "flex", width: "90%", height: "75vh" }}>
          <div style={{ margin: "auto" }}>
            {questions.map(function(question, i) {
                question.type = getType(question);

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
                            {i+1}. {question.prompt}
                          </Typography>
                        </Box>
                        <Box
                          display={"flex"}
                          width={500}
                          height={100}
                          alignItems="center"
                          justifyContent="center"
                          anchor="center"
                        >
                          {renderCorrectComponent(question)}
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
                            label="Explain (optional)"
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
                onClick={(states) => handleSubmit}
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
