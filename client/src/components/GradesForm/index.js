import React, { useEffect, useState } from "react";
import { TextField, Box, Switch, Typography, CircularProgress, Divider, Button } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { parseTime } from '../../utils/misc';
import DocumentPicker from "../DocumentPicker"
import EnrolledClasses from "../EnrolledClasses";
import ConfirmDialog from "../ConfirmDialog";

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import "../../utils/flowHeaders.min.css";
import API from "../../utils/API";
import { faChalkboardTeacher, faAppleAlt, faUserGraduate } from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles(theme => ({
    root: {
        
        width: "100%",
    },
    field: {
        margin: "1rem 0px"
    },
    vc: {
        // maxWidth: "500px",
        // width: "90%",
        // margin: "auto"
    },
    margin: {
        marginBottom: "2rem"
     },
     btn: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        // gap: "0.625rem",
        height: "3.00rem",
        padding: "0.5625rem 1.25rem",
        flexShrink: "0",
        fontSize: "1.75rem",
        borderRadius: "1.5rem",
        fontFamily: "Nunito",
        borderTop: "1px solid #005FD9",
        borderRight: "1px solid #005FD9",
        borderBottom: "4px solid #005FD9",
        borderLeft: "1px solid #005FD9",
        background: "#2584FF",
        color: "#FFF",
        // margin: "1rem",
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
    const [gradeStatus, setGradeStatus] = useState(props.document.status || 'unpublished');
    const [PROPS, setProps] = useState(props)
    const [checked, setChecked] = useState(gradeStatus === 'active' ? true : false)
    const [confirmOpen, setConfirmOpen] = useState(false);


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

    const changeStatus = (e) => {
        setChecked(e.target.checked);
        let status = e.target.checked ? 'active' : 'unpublished';
        setGradeStatus(status);

        let newEvent = { ...e, target: { ...e.target, name: 'status', value: status } };

        PROPS.handleChange(newEvent);
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

    const rerouteSubjects = () => {
        props.history.push({
            pathname: `/edit/subjects`,
        })
    
    }

    const archiveGrade = () => {
        setConfirmOpen(true);
    }

    const handleConfirm = (isOpen) => {
        setConfirmOpen(isOpen);
      };
      
    const handleArchive = (e) => {
        setChecked(false);
        let status = 'archived';
        setGradeStatus(status);

        let newEvent = { ...e, target: { ...e.target, name: 'status', value: status } };

        PROPS.handleChange(newEvent);
        setConfirmOpen(false);
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
                
                <FormControlLabel control={<Checkbox checked={checked} onChange={changeStatus}/>} label="Publish Grade" />

                {/* TODO: This has issues when editing subjects for a grade, also with 'gradeLabel' prop */}
                {/* <div className={classes.margin}>
                    <EnrolledClasses subjects={props.document.subjects} status={gradeStatus} title={'CURRENT SUBJECTS'} editable={false}></EnrolledClasses>
                </div> */}
                
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

                <Button className={classes.btn} onClick={rerouteSubjects}>Edit Subjects</Button>

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
            
            <ConfirmDialog
                open={confirmOpen}
                buttonText={'Archive this Grade'}
                handleClose={() => {
                handleConfirm(false);
                
                }}
                handleAction={handleArchive}
            >
                This will mark this grade as{" "}
                <Typography
                variant="body1"
                style={{ display: "inline", fontWeight: "bold" }}
                >
                archived and read only.
                </Typography>{" "}
                You can undo this action within grade page settings.
            </ConfirmDialog>
            
            <Button className={classes.btn} onClick={archiveGrade} disabled={gradeStatus === 'archived'}>Archive Grade</Button>

        </div>
    )
};

export default GradesForm;