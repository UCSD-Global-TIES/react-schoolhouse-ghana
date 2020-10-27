import React, { Component } from "react";
import {
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio
} from "@material-ui/core";

const AssessmentMCForm = ({ answers, handleResponseAnswer }) => {
  return (
    <FormControl component="fieldset">
      <RadioGroup onChange={(ev) => handleResponseAnswer(ev.target.value)} row>
        {answers.map(function (answer) {
          return (
            <FormControlLabel
              value={answer}
              control={<Radio />}
              label={answer}
              labelPlacement="bottom"
            />
          );
        })}
      </RadioGroup>
    </FormControl>
  );

}

export default AssessmentMCForm;

