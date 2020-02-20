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

const disabledMsg = `This field will be populated after file creation.`

const textFields = [
    {
        name: "nickname",
        label: "File Nickname",
        helper: "This is an informative nickname for this file."
    },
    {
        name: "filename",
        label: "File Name",
        disabled: true,
        helper: "This is the actual name of the file on the NAS."
    },
    {
        name: "path",
        label: "File Path",
        disabled: true,
        helper: "This is the path of this file on the NAS."
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

function FilesForm(props) {
    const classes = useStyles();

    useEffect(() => {

    }, []);

    return (
        <div className={classes.root}>
            <div className={classes.vc}>
                {/* Add field to upload file */}
                {/* for websites - upload folder but mark path to the index.html file */}
                
                {/* Add file preview */}
                {/* iFrame - websites */}
                {/* react-pdf - pdfs */}
                {/* react-file-viewer - images, csv, docx, mp4 */}

                {
                    textFields.map((item, idx) => (
                        <TextField

                            key={`${item.name}-form-${idx}`}
                            className={classes.field}
                            label={item.label}
                            name={item.name}
                            placeholder={(item.disabled || (item.updateOnly && props.isCreate)) ? disabledMsg : ""}
                            disabled={(item.disabled || (item.updateOnly && props.isCreate) || (item.createOnly && !props.isCreate))}
                            value={(props.isDate ? parseTime(props.document[item.name]) : null) || ""}
                            helperText={item.helper}
                            onChange={props.handleChange}
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

            </div>
        </div>
    )
};

export default FilesForm;