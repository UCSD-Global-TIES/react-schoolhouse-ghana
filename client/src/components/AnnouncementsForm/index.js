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
        // display: "flex"
    },
    field: {
        margin: "1rem 0px"
    },
    vc: {
        // maxWidth: "500px",
        // width: "90%",
        // margin: "auto"
    },
    title: {
        color: '#AFAFAF',
        fontFamily: 'Nunito',
        fontSize: '16px',
        fontStyle: 'normal',
        fontWeight: 700,
        lineHeight: 'normal',
    },
    customTextField: {
        borderRadius: '20px', // Adjust the value as needed
    },
}));

const disabledMsg = `This field will be populated after announcement creation.`

const textFields = [
    {
        name: "title",
        title: "TITLE",
        required: true,
        // helper: "This is an informative title of this announcement."
    },

    {
        name: "createdAt",
        // label: "Created On",
        title: "CREATED ON",
        isDate: true,
        disabled: true,
        // helper: "This is the date this announcement was created."
    },


    {
        name: "message",
        // label: "Content",
        title: "MESSAGE",
        multiline: true,
        required: true,
        // helper: "This is the main content of this announcement."
    },
    // {
    //     name: "authorName",
    //     // label: "Author Name",
    //     disabled: true,
    //     helper: "This is the name of the announcement's author."
    // },

    // {
    //     name: "updatedAt",
    //     // label: "Last Updated",
    //     isDate: true,
    //     disabled: true,
    //     helper: "This is the date this announcement was last updated."
    // },


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
        <React.Fragment>
        {/* <div style={{width: '100%', height: '100%', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 10, display: 'inline-flex'}}>
        <div style={{color: '#4B4B4B', fontSize: 28, fontFamily: 'Asap Condensed', fontWeight: '400', textDecoration: 'underline', wordWrap: 'break-word'}}>Home</div>
        <div style={{color: '#4B4B4B', fontSize: 28, fontFamily: 'Asap Condensed', fontWeight: '400', wordWrap: 'break-word'}}>/</div>
        <div style={{color: '#4B4B4B', fontSize: 28, fontFamily: 'Asap Condensed', fontWeight: '700', textDecoration: 'underline', wordWrap: 'break-word'}}>Announcements Editor</div>
        </div> */}
        <div className={classes.root}>
            <div className={classes.vc}>

                {
                    
                    textFields.map((item, idx) => (
                        <React.Fragment key={`${item.name}-form-${idx}`}>

                        {/* Display title above the input field */}
                        <Typography className={classes.title} variant="subtitle1"
                            >{item.title}</Typography>
                        {/* Render TextField */}
                        
                        <TextField
                            InputProps={{
                                style: { borderRadius: '12px' }, // Adjust the value as needed
                            }}
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
                            // InputLabelProps={{
                            //     shrink: true,
                            // }}
                            multiline={item.multiline}
                            rows={3}
                            variant="outlined"
                        />
                        </React.Fragment>
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
        </React.Fragment>
    )
};

export default AnnouncementsForm;