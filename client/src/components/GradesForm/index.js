import React, { useEffect, useState } from "react";
import { TextField, Box, Switch, Typography, CircularProgress } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { parseTime } from '../../utils/misc';
import { Autocomplete } from '@material-ui/lab';
import { faChalkboardTeacher } from "@fortawesome/free-solid-svg-icons";
import DocumentEditorLink from '../DocumentEditorLink'


import "../../utils/flowHeaders.min.css";

const useStyles = makeStyles(theme => ({
    root: {
        padding: "3rem 0rem",
        display: "flex"
    },
    field: {
        margin: "1rem 0px"
    },
    vc: {
        maxWidth: "500px",
        width: "90%",
        margin: "auto"
    }
}));

const disabledMsg = `This field will be populated after grade creation.`

const textFields = [
    {
        name: "level",
        label: "Grade Level",
        helper: "This is the numerical level of this grade.",
        createOnly: true,
        isNumber: true
    },
    {
        name: "path",
        label: "Folder Path",
        disabled: true,
        helper: "This is the folder path of this grade on the NAS."
    },
    {
        name: "createdAt",
        label: "Created On",
        isDate: true,
        disabled: true,
        helper: "This is the date this grade was created."
    },
    {
        name: "updatedAt",
        label: "Last Updated",
        isDate: true,
        disabled: true,
        helper: "This is the date this grade was last updated."
    },

]

// Private field is special use case

function GradesForm(props) {
    const classes = useStyles();
    const MIN_GRADE = 1;
    const testClasses = [
        {
            _id: "1",
            name: "English"
        }
    ]

    const handleNumberChange = (e) => {
        const { value, name } = e.target;
        let tmp = {
            target: {
                name,
                value
            }
        }

        // Prevent manual input of negative numbers
        if (parseInt(value) < MIN_GRADE) {
            tmp.target.value = MIN_GRADE;
        }

        props.handleChange(tmp);
    }

    useEffect(() => {

    }, []);

    return (
        <div className={classes.root}>
            <div className={classes.vc}>
                {
                    textFields.map((item, idx) => (
                        <TextField
                            // Just for Grade 'level' field
                            type={item.isNumber ? "number" : "text"}
                            key={`${item.name}-form-${idx}`}
                            className={classes.field}
                            label={item.label}
                            name={item.name}
                            placeholder={(item.disabled || (item.updateOnly && props.isCreate)) ? disabledMsg : ""}
                            disabled={(item.disabled || (item.updateOnly && props.isCreate) || (item.createOnly && !props.isCreate))}
                            value={(props.isDate ? parseTime(props.document[item.name]) : null) || ((item.isNumber && !props.document[item.name]) ? MIN_GRADE : null) || props.document[item.name] || ""}
                            helperText={item.helper}
                            onChange={item.isNumber ? handleNumberChange : props.handleChange}
                            fullWidth
                            autoComplete={'off'}
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            multiline={item.multiline}
                            rows={3}
                            variant="outlined"
                        />
                    ))}
                {/* Only show if document was already created */}
                {
                    props.document['_id'] &&
                    <DocumentEditorLink
                        // _id of document that is being updated
                        docId={props.document['_id']}
                        primary={'name'}
                        collection={'Classes'}
                        icon={faChalkboardTeacher}
                        link={"/edit/classes/"}
                        docs={testClasses}
                        {...props}
                    />
                }

            </div>
        </div>
    )
};

export default GradesForm;