import React, { Component } from "react";
import {
    Slider,
    Typography
} from "@material-ui/core";

const AssessmentRateForm = ({ question }) => {

    const valueText = (val) => `${val}`;
    const valueLabelFormat = (val) => val;

    return (
        <>
            <Slider
                defaultValue={0}
                valueLabelFormat={valueLabelFormat}
                getAriaValueText={valueText}
                aria-labelledby="discrete-slider-small-steps"
                step={1}
                marks
                min={question.ratingStart}
                max={question.ratingEnd}
                valueLabelDisplay="auto"
            />
        </>
    );
}

export default AssessmentRateForm;

