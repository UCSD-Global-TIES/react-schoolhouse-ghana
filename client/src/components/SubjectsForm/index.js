import React, { useEffect, useState } from "react";
import { TextField, Box, Switch, Typography, CircularProgress } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { parseTime } from '../../utils/misc';
import { Autocomplete } from '@material-ui/lab';
import DocumentPicker from "../DocumentPicker"
import DocumentEditorLink from '../DocumentEditorLink'

import "../../utils/flowHeaders.min.css";
import API from "../../utils/API";
import { faFile, faBullhorn } from "@fortawesome/free-solid-svg-icons";

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

const disabledMsg = `This field will be populated after subject creation.`

const textFields = [
    {
        name: "name",
        label: "Subject Name",
        required: true,
        helper: "This is the name of this subject."
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

function SubjectsForm(props) {
    const classes = useStyles();
    const [loading, setLoading] = useState(true);
    const [fileOptions, setFileOptions] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState(props.document.files || []);
    const [options, setOptions] = useState([]);
    const [gradeValue, setGradeValue] = useState({});
    const [PROPS, setProps] = useState(props)

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
        promises.push(API.getFiles(PROPS.user.key))

        Promise.all(promises)
            .then((results) => {
                // Retrieve grades and populate subjects
                // For every grade...
                let gradeOptions = results[0].data;

                const selected = [];
                if (props.document.files) {
                    for (const fileID of props.document.files) {
                        selected.push(fileID)
                    }
                }
                setSelectedFiles(selected)

                // Set options and loading flag to false
                setOptions(gradeOptions);
                setFileOptions([...results[1].data]);
                setLoading(false);

                // // Set default autocomplete value
                if (!PROPS.isCreate) {
                    for (const option of gradeOptions) {
                        for (const optionSubject of option.subjects) {
                            if (optionSubject._id == PROPS.document._id) {
                                setGradeValue(option);
                                return;
                            }
                        }
                    }
                }

            })


    }, []);

    useEffect(() => {
        setProps(props);

        // // // Set default autocomplete value
        // if (!PROPS.isCreate) {
        //     for (const option of options) {
        //         for (const optionSubject of option.subjects) {
        //             if (optionSubject._id == PROPS.document._id) {
        //                 setGradeValue(option);
        //                 return;
        //             }
        //         }
        //     }
        // }


    }, [props])

    return (
        <div className={classes.root}>
            <div className={classes.vc}>
                <div style={{ width: "100%" }}>

                    <Autocomplete
                        onChange={(e, value) => handleAutocompleteChange(e, value, 'grade')}
                        value={options.find(option => option._id == PROPS.document['grade']) || gradeValue || {}}
                        className={classes.field}
                        loading={loading}
                        // Sort by category tag (sort by increasing grade)
                        options={options.sort((a, b) => a.level - b.level)}
                        // Option text
                        getOptionLabel={option => option.level ? `Grade ${option.level}` : ""}
                        renderInput={params => (
                            <TextField
                                {...params}
                                label="Grade Name"
                                helperText="This subject will only be viewable to this grade."
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

                {!PROPS.isCreate &&
                    <DocumentEditorLink
                        link={'/edit/announcements'}
                        docs={PROPS.document.announcements || []}
                        icon={faBullhorn}
                        collection={"Subject Announcements"}
                        primary={"title"}
                        match={PROPS.match}
                        docId={PROPS.document._id}
                        history={PROPS.history}
                        delete={API.deleteAnnouncements}
                        user={PROPS.user}
                        preset={(doc) => { return { subject: doc._id, private: true } }}
                    />
                }

                <DocumentPicker
                    link={(doc) => doc.path}
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

export default SubjectsForm;