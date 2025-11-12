import React, { useEffect, useState } from "react";
import { TextField, Box, Switch, Typography, CircularProgress } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { parseTime } from '../../utils/misc';
import { Autocomplete } from '@material-ui/lab';
import DocumentPicker from "../DocumentPicker";

import "../../utils/flowHeaders.min.css";
import API from "../../utils/API";
import { faFile } from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    },
    field: {
        margin: "1rem 0px",
        '& .MuiInputLabel-root': {
            fontSize: '1rem',
            color: theme.palette.text.secondary,
        },
        '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            '& fieldset': {
                borderColor: theme.palette.grey[300],
            },
            '&:hover fieldset': {
                borderColor: theme.palette.primary.main,
            },
            '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main,
            },
        },
    },
    switchContainer: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '1rem',
    },
    switchLabel: {
        flexGrow: 1,
    },
        vc: {
        // maxWidth: "500px",
        // width: "90%",
        // margin: "auto"
        display: "flex",
        flexDirection: "column",
        width: "100%",
    },
    toggleContainer: {
        display: "flex",
        justifyContent: "flex-end",
        width: "100%",
        padding: "0.5rem 0",
    }
}));

const disabledMsg = `Today's Date`;

const textFields = [
    {
        name: "title",
        label: "Title *",
        required: true,
        helper: "This is an informative title of this announcement."
    },
    {
        name: "createdAt",
        label: "Created On *",
        isDate: true,
        disabled: true,
        helper: "This field will be auto-populated upon submission."
    },
    {
        name: "content",
        label: "Message *",
        multiline: true,
        required: true,
        helper: "This is the main content of this announcement."
    },
];

const filteredTextFields = textFields.filter(field => field.name !== "authorName" && field.name !== "updatedAt");

function AnnouncementsForm(props) {
    const classes = useStyles();
    const [loading, setLoading] = useState(true);
    const [fileOptions, setFileOptions] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState(props.document.files || []);
    const [options, setOptions] = useState([]);
    const [subjectValue, setSubjectValue] = useState(null);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [multiSubjectMode, setMultiSubjectMode] = useState(false);
    const [PROPS, setProps] = useState(props);
    const [viewMode, setViewMode] = useState(!props.isCreate);

    // Check if user is admin to show multi-subject option
    const isAdmin = PROPS.user && PROPS.user.type === 'Admin';

    // Audience targeting options for admins
    const audienceOptions = [
        { _id: 'both', name: 'Teachers & Students', description: 'Visible to both teachers and students' },
        { _id: 'teachers', name: 'Teachers Only', description: 'Visible only to teachers' },
        { _id: 'students', name: 'Students Only', description: 'Visible only to students' }
    ];

    const handleSwitchToggle = name => e => {
        const event = {
            target: {
                name,
                value: e.target.checked
            }
        };
        PROPS.handleChange(event);
    };

    const handleAutocompleteChange = (e, value, name) => {
        if (e && value && name) {
            const event = {
                target: {
                    name,
                    value: value._id
                }
            };
            PROPS.handleChange(event);
        }
    };

    const handleMultiSubjectChange = (e, value) => {
        setSelectedSubjects(value);
        // Update the parent component with selected subject IDs
        const event = {
            target: {
                name: 'subjects',
                value: value.map(subject => subject._id)
            }
        };
        PROPS.handleChange(event);
    };

    const handleMultiSubjectModeToggle = (e) => {
        setMultiSubjectMode(e.target.checked);
        if (e.target.checked) {
            // If turning on multi-subject mode, clear single subject
            setSubjectValue(null);
            const singleSubjectEvent = {
                target: {
                    name: 'subject',
                    value: null
                }
            };
            PROPS.handleChange(singleSubjectEvent);
        } else {
            // If turning off multi-subject mode, clear selected subjects
            setSelectedSubjects([]);
            const multiSubjectEvent = {
                target: {
                    name: 'subjects',
                    value: []
                }
            };
            PROPS.handleChange(multiSubjectEvent);
        }
    };

    const handlePickChange = (name, selectedDocs) => {
        setSelectedFiles(selectedDocs);

        const event = {
            target: {
                name,
                value: selectedDocs
            }
        };
        PROPS.handleChange(event);
    };

    useEffect(() => {
        const promises = [];
        promises.push(API.getGrades(PROPS.user.key));
        promises.push(API.getFiles(PROPS.user.key));

        Promise.all(promises)
            .then((results) => {
                let subjectOptions = [];
                for (const gradeDoc of results[0].data) {
                    for (const subjectDoc of gradeDoc.subjects) {
                        subjectOptions.push({ name: subjectDoc.name, grade: gradeDoc.level, _id: subjectDoc._id });
                    }
                }

                const selected = [];
                if (props.document.files) {
                    for (const file of props.document.files) {
                        selected.push(file._id);
                    }
                }
                setSelectedFiles(selected);
                setOptions(subjectOptions);
                setFileOptions([...results[1].data]);
                setLoading(false);

                for (const option of subjectOptions) {
                    if (option._id === PROPS.document.subject) {
                        setSubjectValue(option);
                    }
                }
            });
    }, []);

    useEffect(() => {
        if (PROPS.document.subject !== props.document.subject) {
            for (const option of options) {
                if (option._id === props.document.subject) {
                    setSubjectValue(option);
                }
            }
        }
        setProps(props);
    }, [props]);

    const toggleViewMode = () => {
        setViewMode(!viewMode);
    }

    return (
        // <React.Fragment>
        <div className={classes.root}>
        <div className={classes.toggleContainer}>
                <Switch
                    checked={viewMode}
                    onChange={toggleViewMode}
                    name="viewModeToggle"
                    color="primary"
                />
                <Typography>{viewMode ? "Viewer Mode" : "Edit Mode"}</Typography>
            </div>
            <div className={classes.vc}>
            {!viewMode && (
                <div style={{ width: "100%" }}>
                    <Box className={classes.field} display="flex">
                        <Box flexGrow={1}>
                            Subject-Specific <Typography display='inline' variant='caption' color='textSecondary'>Specifies if this announcement is viewable to the entire school.</Typography>
                        </Box>
                        <Box>
                            <Switch
                                disabled={!PROPS.isCreate}
                                checked={PROPS.document['private'] || false}
                                onChange={handleSwitchToggle('private')}
                                color="primary"
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                            />
                        </Box>
                    </Box>

                    {/* Multi-subject mode toggle for admins */}
                    {isAdmin && PROPS.document['private'] && (
                        <Box className={classes.field} display="flex">
                            <Box flexGrow={1}>
                                Multiple Subjects <Typography display='inline' variant='caption' color='textSecondary'>Post to multiple subjects at once.</Typography>
                            </Box>
                            <Box>
                                <Switch
                                    disabled={!PROPS.isCreate}
                                    checked={multiSubjectMode}
                                    onChange={handleMultiSubjectModeToggle}
                                    color="primary"
                                    inputProps={{ 'aria-label': 'multi-subject toggle' }}
                                />
                            </Box>
                        </Box>
                    )}
                    {/* Single subject selector - for teachers and non-multi-subject mode */}
                    {!multiSubjectMode && (
                        <Autocomplete
                            onChange={(e, value) => handleAutocompleteChange(e, value, 'subject')}
                            value={subjectValue}
                            disabled={!PROPS.document['private'] || !PROPS.isCreate}
                            className={classes.field}
                            loading={loading}
                            options={options.sort((a, b) => a.grade - b.grade)}
                            groupBy={option => `Grade ${option.grade}`}
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
                    )}

                    {/* Multi-subject selector - for admins in multi-subject mode */}
                    {isAdmin && multiSubjectMode && PROPS.document['private'] && (
                        <Autocomplete
                            multiple
                            onChange={handleMultiSubjectChange}
                            value={selectedSubjects}
                            disabled={!PROPS.isCreate}
                            className={classes.field}
                            loading={loading}
                            options={options.sort((a, b) => a.grade - b.grade)}
                            groupBy={option => `Grade ${option.grade}`}
                            getOptionLabel={option => option.name}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    label="Select Subjects"
                                    helperText="This announcement will be posted to all selected subjects."
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
                    )}
                    </div>
                )}
                {viewMode ? (
                    <div style={{ width: '100%', height: '100%', paddingLeft: 70, paddingRight: 70, paddingTop: 56, paddingBottom: 56, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 36, display: 'inline-flex' }}>
                        <div style={{ alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'center', gap: 12, display: 'inline-flex' }}>
                            <div style={{ color: '#4B4B4B', fontSize: 60, fontFamily: 'Asap Condensed', fontWeight: '700', wordWrap: 'break-word' }}>{PROPS.document.title}</div>
                        </div>
                        <div style={{ alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 8, display: 'inline-flex' }}>
                            <div style={{ justifyContent: 'center', alignItems: 'flex-start', gap: 8, display: 'flex' }}>
                                <div style={{ color: '#AFAFAF', fontSize: 18, fontFamily: 'Nunito', fontWeight: '700', wordWrap: 'break-word' }}>CREATED ON:</div>
                                <div style={{ color: '#AFAFAF', fontSize: 18, fontFamily: 'Nunito', fontWeight: '700', wordWrap: 'break-word' }}>{parseTime(PROPS.document.createdAt)}</div>
                            </div>
                        </div>
                        <div style={{ alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end', gap: 32, display: 'flex' }}>
                            <div style={{ alignSelf: 'stretch' }}><span style={{ color: '#4B4B4B', fontSize: 24, fontFamily: 'Nunito', fontWeight: '400', wordWrap: 'break-word', whiteSpace:'pre-wrap' }}>{PROPS.document.content}</span></div>
                        </div>
                    </div>
                ) : (
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
                    ))
                )}

                {/* Audience targeting for admin announcements */}
                {isAdmin && !viewMode && (
                    <Autocomplete
                        onChange={(e, value) => handleAutocompleteChange(e, value, 'targetAudience')}
                        value={audienceOptions.find(option => option._id === (PROPS.document.targetAudience || 'both'))}
                        disabled={!PROPS.isCreate}
                        className={classes.field}
                        options={audienceOptions}
                        getOptionLabel={option => option.name}
                        renderInput={params => (
                            <TextField
                                {...params}
                                label="Target Audience"
                                helperText="Specify who can see this announcement."
                                fullWidth
                                variant="outlined"
                            />
                        )}
                    />
                )}

                {!viewMode && (
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
                )}
            </div>
        </div>

    );
}

export default AnnouncementsForm;
