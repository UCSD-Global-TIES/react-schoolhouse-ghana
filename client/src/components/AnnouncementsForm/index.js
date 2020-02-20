import React, { useEffect, useState } from "react";
import { TextField, Box, Switch, Typography, CircularProgress } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { parseTime } from '../../utils/misc';
import { Autocomplete } from '@material-ui/lab';


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

    useEffect(() => {
        setTimeout(() => {
            // Retrieve classes and populate grades
            // For every class...

            const result = {
                data: [

                    {
                        name: "Math",
                        grade: { level: 2 },
                        _id: "1"

                    },
                    {
                        name: "English",
                        grade: { level: 1 },
                        _id: "2"
                    }
                ]
            };

            let classOptions = [];
            for (const classDoc of result.data) {
                // Push object containing class name, grade level, and class_id (see 'classOptions')
                classOptions.push({ name: classDoc.name, grade: classDoc.grade.level, _id: classDoc._id })
            }

            // Set options and loading flag to false
            setOptions(classOptions);
            setLoading(false);

        }, 1000)
    }, []);

    return (
        <div className={classes.root}>
            <div className={classes.vc}>
                <div style={{ width: "100%" }}>
                    <Box className={classes.field} display="flex">
                        <Box flexGrow={1}>
                            Private <Typography display='inline' variant='caption' color='textSecondary'> Specifies if this announcement is viewable to all users.</Typography>
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
                        onChange={(e, value) => handleAutocompleteChange(e, value, 'class')}
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
                                label="Class Name"
                                helperText="This announcement will only be viewable to the selected class."
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

            </div>
        </div>
    )
};

export default AnnouncementsForm;