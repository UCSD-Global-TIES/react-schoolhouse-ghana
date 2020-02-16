import React, { useEffect, useState } from "react";
import { TextField, Box, Switch, Typography, CircularProgress } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { parseTime } from '../../utils/misc';
import { Autocomplete } from '@material-ui/lab';
import { faFile, faUserGraduate, faBullhorn, faAppleAlt} from "@fortawesome/free-solid-svg-icons";
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

const disabledMsg = `This field will be populated after class creation.`

const textFields = [
    {
        name: "name",
        label: "Name",
        helper: "This is the name of this class."
    },
    {
        name: "path",
        label: "Folder Path",
        disabled: true,
        helper: "This is the folder path of this class on the NAS."
    },
    {
        name: "createdAt",
        label: "Created On",
        isDate: true,
        disabled: true,
        helper: "This is the date this class was created."
    },
    {
        name: "updatedAt",
        label: "Last Updated",
        isDate: true,
        disabled: true,
        helper: "This is the date this class was last updated."
    },

]

// Private field is special use case

function ClassesForm(props) {
    const classes = useStyles();
    const [loading, setLoading] = useState(true);
    const [options, setOptions] = useState([]);

    const testAnnouncements = [
        {
            _id: "1",
            title: "Announcement Title"
        }
    ]

    const testTeachers = [
        {
            _id: "1",
            first_name: "Matteu",
            last_name: "Chen"
        }
    ]

    const testStudents = [
        {
            _id: "1",
            first_name: "Matt",
            last_name: "Chen"
        }
    ]

    const testFiles = [
        {
            _id: "1",
            nickname: "Test File"
        }
    ]

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

    useEffect(() => {
        setTimeout(() => {
            // Retrieve all grades

            const result = {
                data: [
                    {
                        level: 1,
                        _id: "1"

                    },
                    {
                        level: 2,
                        _id: "2"

                    },
                ]
            };

            let gradeOptions = result.data;
            
            // Set options and loading flag to false
            setOptions(gradeOptions);
            setLoading(false);

        }, 1000)
    }, []);

    return (
        <div className={classes.root}>
            <div className={classes.vc}>
            <Autocomplete
                        onChange={(e, value) => handleAutocompleteChange(e, value, 'grade')}
                        disabled={!props.isCreate}
                        className={classes.field}
                        loading={loading}
                        // Sort by category tag (sort by increasing grade level)
                        options={options.sort((a, b) => a.level - b.level)}
                        // Option text
                        getOptionLabel={option => `Grade ${option.level}`}
                        renderInput={params => (
                            <TextField
                                {...params}
                                label="Grade"
                                helperText="This is the grade the class belongs to."
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
                {
                    textFields.map((item, idx) => (
                        <TextField
                            key={`${item.name}-form-${idx}`}
                            className={classes.field}
                            label={item.label}
                            name={item.name}
                            placeholder={(item.disabled || (item.updateOnly && props.isCreate)) ? disabledMsg : ""}
                            disabled={(item.disabled || (item.updateOnly && props.isCreate) || (item.createOnly && !props.isCreate))}
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
                {/* Only show if document was already created */}
                {
                    props.document['_id'] &&
                    <>
                    {/* Document Editor for Announcements */}
                    <DocumentEditorLink
                        // _id of document that is being updated
                        docId={props.document['_id']}
                        primary={'title'}
                        collection={'Announcements'}
                        icon={faBullhorn}
                        link={"/edit/announcements/"}
                        docs={testAnnouncements}
                        {...props}
                    />
                    {/* Document Editor for Teachers */}
                    <DocumentEditorLink
                        // _id of document that is being updated
                        docId={props.document['_id']}
                        primary={'first_name'}
                        collection={'Teachers'}
                        icon={faAppleAlt}
                        link={"/edit/accounts/"}
                        docs={testTeachers}
                        {...props}
                    />
                    {/* Document Editor for Students */}
                    <DocumentEditorLink
                        // _id of document that is being updated
                        docId={props.document['_id']}
                        primary={'first_name'}
                        collection={'Students'}
                        icon={faUserGraduate}
                        link={"/edit/accounts/"}
                        docs={testStudents}
                        {...props}
                    />
                    {/* Document Editor for Files */}                    
                    {/* <DocumentEditorLink
                        // _id of document that is being updated
                        docId={props.document['_id']}
                        primary={'nickname'}
                        collection={'Files'}
                        icon={faFile}
                        link={"/edit/files/"}
                        docs={testFiles}
                        {...props}
                    /> */}
                    </>
                }

            </div>
        </div>
    )
};

export default ClassesForm;