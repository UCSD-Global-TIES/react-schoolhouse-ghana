import React, { useEffect, useState } from "react";
import { TextField, Box, Switch, Typography, CircularProgress } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { parseTime } from '../../utils/misc';
import { Autocomplete } from '@material-ui/lab';
import DocumentPicker from "../DocumentPicker"

import "../../utils/flowHeaders.min.css";
import API from "../../utils/API";
import { faFile } from "@fortawesome/free-solid-svg-icons";

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
    },
}));

const disabledMsg = `This field will be populated after announcement creation.`

const textFields = [
    {
        name: "title",
        label: "Title",
        helper: "This is an informative title of this announcement."
    },
    {
        name: "content",
        label: "Content",
        multiline: true,
        helper: "This is the main content of this announcement."
    },
    {
        name: "author",
        label: "Author ID",
        disabled: true,
        helper: "This is the account ID of the announcement's author."
    },
    {
        name: "authorType",
        label: "Author Type",
        disabled: true,
        helper: "This is the account type of the announcement's author."
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

function AnnouncementsForm(props) {
    const classes = useStyles();
    const [loading, setLoading] = useState(true);
    const [fileOptions, setFileOptions] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState(props.document.files || []);
    const [options, setOptions] = useState([]);

    const handleSwitchToggle = name => e => {
        const event = {
            target: {
                name,
                value: e.target.checked
            }
        }

        props.handleChange(event)
    }

    const handleAutocompleteChange = (e, value, name) => {
        if (e && value && name) {
            const event = {
                target: {
                    name,
                    value: value._id
                }
            }

            props.handleChange(event)
        }
    }

    const handlePickChange = (name, selectedDocs) => {
        setSelectedFiles(selectedDocs);

        const event = {
            target: {
                name,
                value: selectedDocs
            }
        }

        props.handleChange(event)
    }

    useEffect(() => {
        const promises = [];
        promises.push(API.getGrades(props.user.key));
        promises.push(API.getFiles(props.user.key))

        Promise.all(promises)
            .then((results) => {
                // Retrieve grades and populate subjects
                // For every grade...
                let subjectOptions = [];
                for (const gradeDoc of results[0].data) {
                    for (const subjectDoc of gradeDoc.subjects) {
                        // Push object containing class name, grade level, and class_id (see 'subjectOptions')
                        subjectOptions.push({ name: subjectDoc.name, grade: gradeDoc.level, _id: subjectDoc._id })
                    }
                }

                // Set options and loading flag to false
                setOptions(subjectOptions);
                setFileOptions([...results[1].data]);
                setLoading(false);

            })

    }, []);

    return (
        <div className={classes.root}>
            <div className={classes.vc}>
                <div style={{ width: "100%" }}>
                    <Box className={classes.field} display="flex">
                        <Box flexGrow={1}>
                            Subject-Specific <Typography display='inline' variant='caption' color='textSecondary'> Specifies if this announcement is viewable to the entire school.</Typography>
                        </Box>
                        <Box >
                            <Switch
                                disabled={!props.isCreate}
                                checked={props.document['private'] || false}
                                onChange={handleSwitchToggle('private')}
                                color="primary"
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                            />
                        </Box>
                    </Box>

                    <Autocomplete
                        onChange={(e, value) => handleAutocompleteChange(e, value, 'subject')}
                        disabled={!props.document['private']}
                        className={classes.field}
                        loading={loading}
                        // Sort by category tag (sort by increasing grade)
                        options={options.sort((a, b) => a.grade - b.grade)}
                        // Option category tag (Sort by grade)
                        groupBy={option => `Grade ${option.grade}`}
                        // Option text
                        getOptionLabel={option => option.name}
                        renderInput={params => (
                            <TextField
                                {...params}
                                label="Subject Name"
                                helperText="This announcement will only be viewable to this subject's grade."
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <React.Fragment>
                                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </React.Fragment>
                                    ),
                                }}
                            />
                        )}
                    />

                </div>
                {
                    textFields.map((item, idx) => (
                        <TextField
                            key={`${item.name}-form-${idx}`}
                            className={classes.field}
                            label={item.label}
                            name={item.name}
                            placeholder={(item.disabled || (item.updateOnly && props.isCreate)) ? disabledMsg : ""}
                            disabled={(item.disabled || (item.updateOnly && props.isCreate))}
                            value={(props.isDate ? parseTime(props.document[item.name]) : null) || props.document[item.name] || ""}
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

                <DocumentPicker
                    title={"Attached Files"}
                    docs={fileOptions}
                    pageMax={5}
                    selected={selectedFiles}
                    icon={faFile}
                    collection={"Files"}
                    primary={"nickname"}
                    handleChange={(docs) => handlePickChange('files', docs)}
                />

            </div>
        </div>
    )
};

export default AnnouncementsForm;