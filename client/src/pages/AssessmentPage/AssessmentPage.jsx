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

const getDefaultValue = (questionObj) => {
  switch (getType(questionObj)) {
    case questionType.FRQ:
      return "";
    case questionType.RATE:
      return questionObj.ratingStart;
    case questionType.MC:
      return 0;
  }
}

function AssessmentPage(props) {
  const classes = useStyles();

  const formId = props.match.params.formId;

  const [questions, setQuestions] = useState([]);
  const [answersChosen, setAnswersChosen] = useState({});

  // Grabs data through the AP 
  useEffect(() => {
    API.getAssessmentQuestions(props.user.key, formId)
      .then((questionData) => {
        // Changes the states (in the future should restructure to only use one state)
        setQuestions(questionData.data.questions);
        setAnswersChosen(questionData.data.questions.reduce((acc, curr) => {
          acc[curr._id] = { answer: getDefaultValue(curr) };
          return acc;
        }, {}));
      })
      .catch((err) => console.log(err));
  }, []);

  const handleResponseAnswer = (questionId, answer) => {
    if (questionId in answersChosen) {
      const answerObj = answersChosen[questionId];
      answerObj["answer"] = answer;
      setAnswersChosen(state => ({...state, questionId: answerObj}));
    }
  };

  const handleResponseExplanation = (questionId, explanation) => {
    if (questionId in answersChosen) {
      const answerObj = answersChosen[questionId];
      answerObj["explanation"] = explanation;
      setAnswersChosen(state => ({...state, questionId: answerObj}));
    }
  };

  const renderCorrectComponent = (questionObj) => {
    const proppedFunction = (answer) => handleResponseAnswer(questionObj._id, answer);
    switch (questionObj.type) {
      case questionType.FRQ:
        return <AssessmentFRQForm question={questionObj} handleResponseAnswer={proppedFunction}/>
      case questionType.MC:
        return <AssessmentMCForm answers={questionObj.choices} handleResponseAnswer={proppedFunction}/>
      case questionType.RATE:
        return <AssessmentRateForm question={questionObj} handleResponseAnswer={proppedFunction} />
      default:
        return <></>
    }
  }

  const handleSubmit = async () => {
    try {
      const value = await API.postResponse(props.user.key, answersChosen, formId);
      window.alert("You have submitted the quiz! Going back to the Home page now!");
      props.history.push("/");
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
                            onBlur={(e) => handleResponseExplanation(question._id, e.target.value)}
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
                onClick={handleSubmit}
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
