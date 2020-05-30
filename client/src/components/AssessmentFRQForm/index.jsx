import React, { Component } from "react";
import {
    TextField
} from "@material-ui/core";

class AssessmentFRQForm extends Component {
    state = {
        question: this.props.question
    };

    render() {
        return (
            <TextField
                id="outlined-basic"
                label="Answer"
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
        );
    }
}

export default AssessmentFRQForm;

