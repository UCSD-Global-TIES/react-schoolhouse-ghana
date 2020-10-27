import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom"
import API from "../../../../utils/API"
import SimpleListView from "../../../../components/SimpleListView"
import { Snackbar, Grid, Typography, Dialog, DialogContent, DialogTitle, Slide, DialogActions, CardActionArea, CardContent, CardMedia, Card, Button } from "@material-ui/core";
import { Alert } from '@material-ui/lab';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSchool, faPencilRuler, faChalkboardTeacher, faCheck, faPager } from "@fortawesome/free-solid-svg-icons"
import "../../../../utils/flowHeaders.min.css";
import "./main.css";
import clsx from "clsx"
import AccessDenied from "../../../../components/AccessDenied";
import PageSpinner from "../../../../components/PageSpinner";
import AnnouncementViewer from "../../../../components/AnnouncementViewer";
import SocketContext from "../../../../socket-context"


const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'inline',
    },
    card: {
        maxWidth: 345,
    },
    cardMedia: {
        height: 140,
    },
    textGlow: {
        color: "white",
        textShadow: "2px 2px 7px #787676"
    },
    boxShadow: {
        boxShadow: "10px 10px 5px #bebebe"
    }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function UserPortal(props) {
    const socket = React.useContext(SocketContext)

    const classes = useStyles();
    const MAX_ANN = 3;

    // HOOKS 
    // Stores this grade's information
    const [subjects, setSubjects] = useState({});

    // Stores current grade announcements
    const [gradeAnnouncements, setGradeAnnouncements] = useState([])
    // Stores current school announcements
    const [schoolAnnouncements, setSchoolAnnouncements] = useState([])
    // Stores impact assessments
    const [assessments, setAssessments] = useState([])
    console.log(assessments);

    // If loading, show loading screen
    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

    const [studentDialog, setStudentDialog] = useState(false);

    const [studentList, setStudentList] = useState([]);

    // Route user to clicked subject page
    const handleOpenSubject = (subject_id) => {
        props.history.push(`/subject/${subject_id}`);
    }

    const handleRefresh = () => {
        setRefreshing(true);

        const promises = [];

        // Get 'Grade' associated with user account, populating subjects and their announcements
        promises.push(API.getUserGrade(props.user.profile._id, props.user.key));

        // Get school announcements
        promises.push(API.getSchoolAnnouncements(props.user.key));

        // Get different impact assessments
        promises.push(API.getAssessments(props.user.key));

        Promise.all(promises)
            .then((promiseResults) => {
                // Get & set grade's subjects info
                setSubjects(promiseResults[0].data ? promiseResults[0].data.subjects : []);

                // Get & Set school announcements
                setSchoolAnnouncements([...promiseResults[1].data]);

                // Get subject announcements
                let subjectAnnList = [];
                if (promiseResults[0].data) {
                    for (const subjectDoc of promiseResults[0].data.subjects) {
                        subjectAnnList = subjectAnnList.concat(subjectDoc.announcements)
                    }
                }

                // Get assessments and sets them
                setAssessments([...promiseResults[2].data]);
                
                // Get & Set Subject announcements
                setGradeAnnouncements([...subjectAnnList]);

                // Set loading false, so the loading screen goes away
                setRefreshing(false);

            })
    }

    const handleOnAssessmentClick = (e) => {
        console.log(e);
    }

    const handleCloseDocument = () => {
        setStudentDialog(false);
    }

    const showPassword = (username, password) => { 
         var x = document.getElementsByClassName('myInput');
         for (var i = 0; i < x.length; i++) { 
             if (x.item(i).type === "password" && x.item(i).name === `${username}` && x.item(i).value === `${password}`) {
                 x.item(i).type = "text";
               } else {
                 x.item(i).type = "password";
               }
         }  
    }

    useEffect(() => {
        const promises = [];

        // Get 'Grade' associated with user account, populating subjects and their announcements
        promises.push(API.getUserGrade(props.user.profile._id, props.user.key))

        // Get school announcements
        promises.push(API.getSchoolAnnouncements(props.user.key))

        // Get different impact assessments
        promises.push(API.getAssessments(props.user.key));

        Promise.all(promises)
            .then((promiseResults) => {
                // Get & set grade's subjects info
                setSubjects(promiseResults[0].data ? promiseResults[0].data.subjects : []);

                // Get & Set school announcements
                setSchoolAnnouncements(promiseResults[1].data);


                let subjectAnnList = []
                if (promiseResults[0].data) {
                    for (const subjectDoc of promiseResults[0].data.subjects) {
                        subjectAnnList = subjectAnnList.concat(subjectDoc.announcements)
                    }
                }

                // Get & Set Subject announcements
                setGradeAnnouncements(subjectAnnList);

                // Get assessments and sets them
                setAssessments([...promiseResults[2].data]);

                // Set Student List
                if (props.user.type === "Teacher") {
                    setStudentList(promiseResults[0].data.students);
                }

                // Set loading false, so the loading screen goes away
                setLoading(false);

            })

        const collections = ['announcements']
        for (const collection of collections) {
            socket.on(`refresh-${collection}`, function () {
                handleRefresh();
            })
        }

    }, [])

    if (loading) {
        return <PageSpinner />
    }

    const renderDialogBox = () => {
        return (
            <Dialog
                    open={studentDialog}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleCloseDocument}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle style={{ padding: "10px 24px" }}
                        align="center" id="student-list">Student List</DialogTitle>

                    <DialogContent style={{ width: "70vw", maxWidth: "500px", padding: "0px 24px" }}>
                        <div className="row"> <p> <b>Student Name</b></p>  <p><b>Username</b> </p> <p><b>Password</b></p> </div>
                        {studentList.map((val, idx) => 
                            <div className="row">
                                <p key={"student-name"+idx}>{val.firstName} {val.lastName}</p>
                                <p key={"student-user"+idx}>{val.username}</p>
                                <p key={"student-pw"+idx}> 
                                    <input type="password" name={val.username} value={val.password} class= "myInput"></input> 
                                    <Button  size="medium" onClick={() => showPassword(val.username, val.password)}>Show/Hide</Button> 
                                </p>
                            </div>
                        )}

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDocument} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
        )
    };

    return (
        <div style={{ display: "flex", width: "100%", marginTop: "5rem" }}>

            {/* ALERTS FOR API ACTIONS */}
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={refreshing}
            >
                <Alert severity={'info'}>
                    Refreshing...
                </Alert>
            </Snackbar>

            { renderDialogBox() }

            <Grid spacing={5} container style={{ padding: "2rem", width: "100%" }}>
                <Grid item xs={12}><Typography style={{ padding: "2rem" }} align='center' className={clsx(classes.textGlow, "flow-text")} variant="h3">welcome back, {props.user.profile.first_name} 😄</Typography> </Grid>
                {/* Announcements */}
                <Grid item xs={12} md={5} lg={4} xl={3}>
                    <div className={classes.boxShadow} >

                        <SimpleListView
                            title={"School Announcements"}
                            items={schoolAnnouncements}
                            pageMax={MAX_ANN}
                            icon={faSchool}
                            labelField={"title"}
                            viewer={AnnouncementViewer}
                        />
                        <SimpleListView
                            title={"Grade Announcements"}
                            items={gradeAnnouncements}
                            pageMax={MAX_ANN}
                            icon={faPencilRuler}
                            labelField={"title"}
                            viewer={AnnouncementViewer}
                        />
                        <SimpleListView
                            title={"Impact Assessments"}
                            items={assessments}
                            pageMax={MAX_ANN}
                            icon={faPager}
                            labelField={"title"}
                            assessmentsLink={true}
                            // onClick={props.history.push(`/assessments/`)}
                        />
                    </div>
                </Grid>

                {/* Subjects */}
                <Grid item xs={12} md={7} lg={8} xl={9}>
                    {
                        subjects.length ?
                            <Grid spacing={1} align="center" container>

                                {
                                    subjects.map((subjectDoc, idx) => (
                                        <Grid onClick={() => handleOpenSubject(subjectDoc._id)} key={`subject-card-${idx}`} item xs={12} sm={6} md={4} lg={3} >
                                            <Card raised className={classes.card}>
                                                <CardActionArea >
                                                    <CardMedia
                                                        className={classes.cardMedia}
                                                        image="https://builtin.com/sites/default/files/styles/og/public/2019-04/big-data-education.png"
                                                        title="Blank"
                                                    />
                                                    <CardContent>
                                                        <Typography gutterBottom variant="h5" component="h2">
                                                            {subjectDoc.name}
                                                        </Typography>
                                                    </CardContent>
                                                </CardActionArea>
                                            </Card>
                                        </Grid>
                                    ))
                                }

                            </Grid>
                            :
                            <div style={{ display: "flex", width: "100%", height: "100%" }}>
                                <div style={{ margin: "auto" }}>
                                    <Typography className="flow-text" style={{ color: "grey" }} variant="h5">No subjects were found.</Typography>
                                    <p style={{ textAlign: "center", color: "grey" }}><FontAwesomeIcon icon={faChalkboardTeacher} size="5x" /></p>
                                </div>
                            </div>
                    }

                </Grid>

                <Grid>
                    {
                        props.user.type === "Teacher" ? 
                            <div className={classes.boxShadow} style={{ marginLeft: "20px" }}>
                              <Button style={{ backgroundColor: "white"}} onClick={() => setStudentDialog(true)} >Student List</Button>
                            </div>
                        : null
                    }
                    
                </Grid>

            </Grid>
        </div>

    );
}

export default UserPortal;
