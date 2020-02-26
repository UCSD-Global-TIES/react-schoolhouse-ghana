import React, { useEffect, useState } from "react";
import { TextField, Box, Switch, Typography, CircularProgress } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { parseTime } from '../../utils/misc';
import DocumentPicker from "../DocumentPicker"

import "../../utils/flowHeaders.min.css";
import API from "../../utils/API";
import { faChalkboardTeacher, faAppleAlt, faUserGraduate } from "@fortawesome/free-solid-svg-icons";

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

const disabledMsg = `This field will be populated after grade creation.`

const textFields = [
    {
        name: "level",
        label: "Grade Level",
        helper: "This is the numerical level of this grade.",
        createOnly: true,
        isNumber: true,
        required: true
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

const MIN_GRADE = 1;
function GradesForm(props) {
    const classes = useStyles();
    const [subjectOptions, setSubjectOptions] = useState([]);
    const [selectedSubjects, setSelectedSubjects] = useState(props.document.subjects || []);
    const [studentOptions, setStudentOptions] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState(props.document.students || []);
    const [teacherOptions, setTeacherOptions] = useState([]);
    const [selectedTeachers, setSelectedTeachers] = useState(props.document.teachers || []);
    const [PROPS, setProps] = useState(props)

    const handleNumberChange = (e) => {
        const { value, name } = e.target;
        let tmp = {
            target: {
                name,
                value
            }
        }

        // Prevent manual input of negative numbers
        if (parseInt(value) < MIN_GRADE) {
            tmp.target.value = MIN_GRADE;
        }

        props.handleChange(tmp);
    }


    const handlePickChange = (name, selectedDocs) => {
        switch (name) {
            case "subjects":
                setSelectedSubjects(selectedDocs);
                break;
            case "students":
                setSelectedStudents(selectedDocs);
                break;
            case "teachers":
                setSelectedTeachers(selectedDocs);
                break;
        }

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
        promises.push(API.getSubjects(props.user.key));
        promises.push(API.getUsers(props.user.key));

        Promise.all(promises)
            .then((results) => {
                const subjectIDs = [];
                if (props.document.subjects) {
                    for (const subject of props.document.subjects) {
                        subjectIDs.push(subject._id);
                    }
                }

                setSelectedSubjects(subjectIDs)

                setSelectedStudents(props.document.students || [])

                setSelectedTeachers(props.document.teachers || [])

                const students = [];
                const teachers = [];
                for (const account of results[1].data) {
                    const { first_name, last_name, profile_id: _id, profile_createdAt: createdAt, profile_updatedAt: updatedAt } = account;
                    const profileObj = {
                        first_name,
                        last_name,
                        _id,
                        createdAt,
                        updatedAt
                    }

                    if (account.type === "Student") students.push(profileObj)
                    if (account.type === "Teacher") teachers.push(profileObj)
                }

                // Set options and loading flag to false
                setSubjectOptions([...results[0].data]);
                setStudentOptions([...students]);
                setTeacherOptions([...teachers]);

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
                            // Just for Grade 'level' field
                            error={PROPS.error[item.name] ? PROPS.error[item.name].exists : null}
                            required={item.required}
                            type={item.isNumber ? "number" : "text"}
                            key={`${item.name}-form-${idx}`}
                            className={classes.field}
                            label={item.label}
                            name={item.name}
                            placeholder={(item.disabled || (item.updateOnly && PROPS.isCreate)) ? disabledMsg : ""}
                            disabled={(item.disabled || (item.updateOnly && PROPS.isCreate) || (item.createOnly && !PROPS.isCreate))}
                            value={(item.isDate ? parseTime(PROPS.document[item.name]) : null) || ((item.isNumber && !PROPS.document[item.name]) ? MIN_GRADE : null) || PROPS.document[item.name] || ""}
                            helperText={PROPS.error[item.name] ? (PROPS.error[item.name].exists ? PROPS.error[item.name].message : item.helper) : item.helper}
                            onChange={item.isNumber ? handleNumberChange : PROPS.handleChange}
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
                    title={"Grade Subjects"}
                    docs={subjectOptions}
                    pageMax={5}
                    selected={selectedSubjects}
                    icon={faChalkboardTeacher}
                    collection={"Subjects"}
                    primary={(doc) => doc.name}
                    handleChange={(docs) => handlePickChange('subjects', docs)}
                />

                <DocumentPicker
                    title={"Students"}
                    docs={studentOptions}
                    pageMax={5}
                    selected={selectedStudents}
                    icon={faUserGraduate}
                    collection={"Students"}
                    primary={(doc) => `${doc.first_name} ${doc.last_name}`}
                    handleChange={(docs) => handlePickChange('students', docs)}
                />

                <DocumentPicker
                    title={"Teachers"}
                    docs={teacherOptions}
                    pageMax={5}
                    selected={selectedTeachers}
                    icon={faAppleAlt}
                    collection={"Teachers"}
                    primary={(doc) => `${doc.first_name} ${doc.last_name}`}
                    handleChange={(docs) => handlePickChange('teachers', docs)}
                />

            </div>
        </div>
    )
};

export default GradesForm;