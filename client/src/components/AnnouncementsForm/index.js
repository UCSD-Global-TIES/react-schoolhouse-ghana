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

function AnnouncementsForm(props) {
    const classes = useStyles();
    const [loading, setLoading] = useState(true);
    const [fileOptions, setFileOptions] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState(props.document.files || []);
    const [options, setOptions] = useState([]);
    const [subjectValue, setSubjectValue] = useState(null);
    const [PROPS, setProps] = useState(props)

    const handleSwitchToggle = name => e => {
        const event = {
            target: {
                name,
                value: e.target.checked
            }
        }

        PROPS.handleChange(event)
    }

    const handleAutocompleteChange = (e, value, name) => {
        if (e && value && name) {
            const event = {
                target: {
                    name,
                    value: value._id
                }
            }

            PROPS.handleChange(event)
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
        PROPS.handleChange(event)
    }

    useEffect(() => {
        const promises = [];
        promises.push(API.getGrades(PROPS.user.key));
        promises.push(API.getFiles(PROPS.user.key));


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

                const selected = [];
                if (props.document.files) {
                    for (const file of props.document.files) {
                        selected.push(file._id)
                    }
                }
                setSelectedFiles(selected)

                // Set options and loading flag to false
                setOptions(subjectOptions);
                setFileOptions([...results[1].data]);
                setLoading(false);

                // Set default autocomplete value
                for (const option of subjectOptions) {
                    if (option._id === PROPS.document.subject) {
                        setSubjectValue(option);
                    }
                }

            })


    }, []);

    useEffect(() => {
        if (PROPS.document.subject !== props.document.subject) {
            // Set default autocomplete value
            for (const option of options) {
                if (option._id === props.document.subject) {
                    setSubjectValue(option);
                }
            }
        }
        setProps(props);


    }, [props])

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
                                disabled={!PROPS.isCreate}
                                checked={PROPS.document['private'] || false}
                                onChange={handleSwitchToggle('private')}
                                color="primary"
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                            />
                        </Box>
                    </Box>

                    <Autocomplete
                        onChange={(e, value) => handleAutocompleteChange(e, value, 'subject')}
                        value={subjectValue}
                        disabled={!PROPS.document['private'] || !PROPS.isCreate}
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
                    primary={(doc) => doc.nickname}
                    handleChange={(docs) => handlePickChange('files', docs)}
                />

            </div>
        </div>
    )
};

export default AnnouncementsForm;