import React, { useEffect, useState } from "react";
import { TextField, CircularProgress, InputAdornment, IconButton } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { generatePassword, parseTime } from '../../utils/misc';
import { Autocomplete } from '@material-ui/lab';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import "../../utils/flowHeaders.min.css";
import API from "../../utils/API"; 

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

const disabledMsg = `This field will be populated after account creation.`

const textFields = [
    {
        name: "first_name",
        label: "First Name",
        required: true,
        helper: "This is the user's first name."
    },
    {
        name: "last_name",
        label: "Last Name",
        required: true,
        helper: "This is the user's last name."
    },
    {
        name: "username",
        label: "Username",
        disabled: true,
        helper: "This is the unique username for this account."
    },
    {
        name: "password",
        label: "Password",
        required: true,
        isHidden: true,
        helper: "This is the password for this account."
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

const accountTypes = ['Student', 'Teacher', 'Admin'];

function AccountsForm(props) {
    const classes = useStyles();
    const [loading, setLoading] = useState(true);
    const [gradeOptions, setGradeOptions] = useState([]);
    const [gradeValue, setGradeValue] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [PROPS, setProps] = useState(props);

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

    const handleTypeChange = (e, value, name) => {
        if (e && value && name) {
            const event = {
                target: {
                    name,
                    value: value
                }
            }

            PROPS.handleChange(event)
        }
    }

    const handleDefaultPassword = () => {
        const event = {
            target: {
                name: "password",
                value: generatePassword()
            }
        }

        PROPS.handleChange(event);
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    };

    const handleMouseDownPassword = event => {
        event.preventDefault();
    };

    const getTextFieldValue = (item) => {
        const dateString = (item.isDate ? parseTime(PROPS.document[item.name]) : null);
        const password = (item.isHidden ? PROPS.document["password"] : null);
        return dateString || PROPS.document[item.name] || password || "";
    }

    useEffect(() => {
        // Sets the default password
        if (!PROPS.document["password"]) handleDefaultPassword();

        const promises = [];

        promises.push(API.getGrades(PROPS.user.key));
        if (!PROPS.isCreate && PROPS.document.type !== 'Admin') {
            promises.push(API.getUserGrade(PROPS.document.profile_id, PROPS.user.key))
        }

        Promise.all(promises)
            .then((results) => {
                // Retrieve grades and populate subjects
                // For every grade...
                let options = results[0].data;

                // Set options and loading flag to false
                setGradeOptions(options);
                setLoading(false);

                // Set default autocomplete value
                if (!PROPS.isCreate && PROPS.document.type !== 'Admin') {
                    const gradeObj = results[1].data
                    setGradeValue(gradeObj);
                }

            })
    }, []);

    useEffect(() => {
        setProps(props);
    }, [props])

    return (
        <div className={classes.root}>
            <div className={classes.vc}>
                <div style={{ width: "100%" }}>
                    <Autocomplete
                        onChange={(e, value) => handleTypeChange(e, value, 'type')}
                        value={PROPS.document['type'] || ""}
                        disabled={!PROPS.isCreate}
                        className={classes.field}
                        options={accountTypes}
                        // Option text
                        getOptionLabel={option => option}
                        renderInput={params => (
                            <TextField
                                {...params}
                                error={PROPS.error['type'] ? PROPS.error['type'].exists : null}
                                label="Account Type"
                                helperText={PROPS.error['type'] ? (PROPS.error['type'].exists ? PROPS.error['type'].message : "This is the account type.") : "This is the account type."}
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <React.Fragment>
                                            {params.InputProps.endAdornment}
                                        </React.Fragment>
                                    ),
                                }}
                            />
                        )}
                    />

                </div>
                <div style={{ width: "100%" }}>
                    <Autocomplete
                        onChange={(e, value) => handleAutocompleteChange(e, value, 'grade')}
                        value={gradeOptions.find(option => option._id == PROPS.document['grade']) || gradeValue || {}}
                        disabled={PROPS.document['type'] === 'Admin'}
                        className={classes.field}
                        loading={loading}
                        // Sort by category tag (sort by increasing grade)
                        options={gradeOptions.sort((a, b) => a.level - b.level)}
                        // Option text
                        getOptionLabel={option => option.level ? `Grade ${option.level}` : ""}
                        renderInput={params => (
                            <TextField
                                {...params}
                                label="User Grade"
                                helperText="This is the user's assigned grade."
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
                    textFields.map((item, idx) => {

                        return (
                        <TextField
                            error={PROPS.error[item.name] ? PROPS.error[item.name].exists : null}
                            required={item.required}
                            key={`${item.name}-form-${idx}`}
                            className={classes.field}
                            label={item.label}
                            name={item.name}
                            placeholder={(item.disabled || (item.updateOnly && PROPS.isCreate)) ? disabledMsg : ""}
                            disabled={(item.disabled || (item.updateOnly && PROPS.isCreate))}
                            value={getTextFieldValue(item)}
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
                            type={item.isHidden && !showPassword ? 'password' : 'text'}
                            InputProps={
                                item.isHidden &&
                                {
                                    endAdornment: <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                    
                                }}

                        />
                    )})}
                    

            </div>
        </div>
    )
};

export default AccountsForm;