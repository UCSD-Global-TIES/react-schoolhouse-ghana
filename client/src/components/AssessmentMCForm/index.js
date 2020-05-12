import React, { Component } from "react";
import {
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio
} from "@material-ui/core";

class AssessmentForm extends Component {
  state = { selected: "" };
  handleChange = event => {
    this.setState({ selected: event.target.value });
  };

  render() {
    const { value } = this.state;
    return (
      <FormControl component="fieldset">
        <RadioGroup value={value} onChange={this.handleChange} row>
          {this.props.answers.map(function(answer) {
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
}

export default AssessmentForm;

