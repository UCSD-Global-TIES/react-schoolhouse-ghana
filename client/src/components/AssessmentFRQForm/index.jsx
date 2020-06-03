import React, { Component } from "react";
import {
    TextField
} from "@material-ui/core";

const AssessmentFRQForm = ({ handleResponseAnswer }) => {
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
            onBlur={(e) => handleResponseAnswer(e.target.value)}
        />
    );
}

export default AssessmentFRQForm;

