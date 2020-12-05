import React, { useEffect, useState } from "react";
import { TextField } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { parseTime } from '../../utils/misc';
import DocumentPicker from "../DocumentPicker"

import "../../utils/flowHeaders.min.css";
import API from "../../utils/API";
import { faFile } from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles(theme => ({
    root: {
        padding: "3rem 0rem",
        display: "flex",
    },
    field: {
        margin: "1rem 0px"
    },
    vc: {
        maxWidth: "500px",
        width: "90%",
        margin: "auto"
    },
}));

const disabledMsg = `This field will be populated after announcement creation.`

const textFields = [
    {
        name: "title",
        label: "Title",
        required: true,
        helper: "This is an informative title of this announcement."
    },
    {
        name: "content",
        label: "Content",
        multiline: true,
        required: true,
        helper: "This is the main content of this announcement."
    },
    {
        name: "authorName",
        label: "Author Name",
        disabled: true,
        helper: "This is the name of the announcement's author."
    },
    {
        name: "createdAt",
        label: "Created On",
        isDate: true,
        disabled: true,
        helper: "This is the date this announcement was created."
    },
    {
        name: "updatedAt",
        label: "Last Updated",
        isDate: true,
        disabled: true,
        helper: "This is the date this announcement was last updated."
    },

]

// Private field is special use case

function SubjectAnnouncementsForm(props) {
    const classes = useStyles();
    const [fileOptions, setFileOptions] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState(props.document.files || []);
    const [PROPS, setProps] = useState(props)

    const handlePickChange = (name, selectedDocs) => {
        setSelectedFiles(selectedDocs);

        const event = {
            target: {
                name,
                value: selectedDocs
            }
        }
        PROPS.handleChange(event)
    }

    useEffect(() => {
        API.getFiles(PROPS.user.key)
            .then((result) => {
                const selected = [];
                if (props.document.files) {
                    for (const file of props.document.files) {
                        selected.push(file)
                    }
                }
                setSelectedFiles(selected)

                // Set options and loading flag to false
                setFileOptions([...result.data]);

            })


    }, []);

    useEffect(() => {
        setProps(props);

    }, [props])

    return (
        <div className={classes.root}>
            <div className={classes.vc}>
                {
                    textFields.map((item, idx) => (
                        <TextField
                            error={PROPS.error[item.name] ? PROPS.error[item.name].exists : null}
                            required={item.required}
                            key={`${item.name}-form-${idx}`}
                            className={classes.field}
                            label={item.label}
                            name={item.name}
                            placeholder={(item.disabled || (item.updateOnly && PROPS.isCreate)) ? disabledMsg : ""}
                            disabled={(item.disabled || (item.updateOnly && PROPS.isCreate))}
                            value={(item.isDate ? parseTime(PROPS.document[item.name]) : null) || PROPS.document[item.name] || ""}
                            helperText={PROPS.error[item.name] ? (PROPS.error[item.name].exists ? PROPS.error[item.name].message : item.helper) : item.helper}
                            onChange={PROPS.handleChange}
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

                <DocumentPicker
                    title={"Attached Files"}
                    docs={fileOptions}
                    pageMax={5}
                    selected={selectedFiles}
                    icon={faFile}
                    collection={"Files"}
                    primary={doc => doc.nickname}
                    handleChange={(docs) => handlePickChange('files', docs)}
                />

            </div>
        </div>
    )
};

export default SubjectAnnouncementsForm;