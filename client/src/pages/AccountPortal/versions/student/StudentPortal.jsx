import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom"
import { IconButton, Grid, Dialog, DialogContent, DialogContentText, DialogTitle, Slide, DialogActions, List, ListItem, ListItemIcon, ListItemText, Typography, ListSubheader, Button, ButtonGroup, CardActionArea, CardActions, CardContent, CardMedia, Card } from "@material-ui/core";
import SchoolIcon from "@material-ui/icons/Apartment";
import ClassIcon from "@material-ui/icons/Class";
import moment from "moment";
import "../../../../utils/flowHeaders.min.css";
import "./main.css";
import clsx from "clsx"

import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos"
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos"

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
    }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


function StudentPortal(props) {
    const classes = useStyles();
    const MAX_ANN = 3; 

    // HOOKS 
    // Stores this student's information
    const [studentInfo, setStudentInfo] = useState({});

    // Stores current school announcements
    const [classAnnouncements, setClassAnnouncements] = useState([])
    const [schoolAnnouncements, setSchoolAnnouncements] = useState([])

    const [schoolAnnPageIdx, setSchoolAnnPageIdx] = useState(0);
    const [classAnnPageIdx, setClassAnnPageIdx] = useState(0);

    // If loading, show loading screen
    const [loading, setLoading] = useState(true);
    // Stores index of current announcement; if null, close ann. modal
    const [dialogOpen, setDialogOpen] = useState(false);

    const [currentAnnouncement, setCurrentAnnouncement] = useState({});

    const testStudent = {
        "first_name": "Neve",
        "last_name": "Foresti",
        "grade": 2,
        "classes": [
            {
                name: "Math",
                teachers: [{
                    first_name: "Sohyun",
                    last_name: "Lee"
                }],
                _id: "1",
                announcements: [
                    {
                        title: "I am the first 'Math' announcement",
                        content: "Look at meee",
                        createdAt: 1581990766
                    },
                    {
                        title: "I am the second 'Math' announcement",
                        content: "Look at meee",
                        createdAt: 1581990766
                    }
                ]
            },
            {
                name: "English",
                _id: "2",
                teachers: [{
                    first_name: "Matt",
                    last_name: "Chen"
                }],
                announcements: [
                    {
                        title: "I am the first 'English' announcement",
                        content: "Look at meee",
                        createdAt: 1581990766
                    },
                    {
                        title: "I am the second 'English' announcement",
                        content: "Look at meee",
                        createdAt: 1581990766
                    }
                ]
            }
        ]
    }

    const testSchoolAnnouncements = [
        {
            title: "I am the first school announcement",
            content: "Look at meee",
            createdAt: 1581990766
        },
        {
            title: "I am the second school announcement",
            content: "Look at meee",
            createdAt: 1581990766
        }
    ]

    const handleOpenCurrentAnn = (ann) => {
        setCurrentAnnouncement(ann);
        setDialogOpen(true);
    }

    const handleCloseAnn = () => {
        setDialogOpen(false);
    }

    const handleOpenClass = (class_id) => {
        props.history.push(`/class/${class_id}`);
    }

    const handlePageChange = (type, direction) => {
        if(type === 'class') setClassAnnPageIdx(classAnnPageIdx + direction)
        else if (type === 'school') setSchoolAnnPageIdx(schoolAnnPageIdx + direction)

        
    }

    useEffect(() => {
        setTimeout(() => {
            // Get & set student info
            setStudentInfo(testStudent);

            // Get & Set school announcements
            setSchoolAnnouncements(testSchoolAnnouncements);

            let classAnnList = []
            for (const classDoc of testStudent.classes) {
                classAnnList = classAnnList.concat(classDoc.announcements)
            }

            // Get & Set Class announcements
            setClassAnnouncements(classAnnList);

            // Set loading false, so the loading screen goes away
            setLoading(false);

        }, 1000)

    }, [])

    if (loading) {
        return (<> Loading </>)
    }

    return (
        <div style={{ display: "flex", width: "100%", marginTop: "5rem" }}>
            {currentAnnouncement.title && 
            <Dialog
                open={dialogOpen}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleCloseAnn}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">{currentAnnouncement.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {currentAnnouncement.content}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAnn} color="primary">
                        Close
          </Button>

                </DialogActions>
            </Dialog>
            
            }
            
            <Grid spacing={5} container style={{padding: "2rem", width:"100%"}}>
                <Grid item xs={12}><Typography style={{padding: "2rem"}} align='center' className={clsx(classes.textGlow, "flow-text")} variant="h3">welcome back, {props.user.profile.first_name} 😄</Typography> </Grid>
                {/* Announcements */}
                <Grid item xs={12} md={5} lg={4} xl={3}>
                    <List
                        className={classes.root}
                        subheader={
                            <ListSubheader component="div" style={{display: "flex", justifyContent: "space-between"}}>
                                <span>School Announcements</span>
                                <ButtonGroup size="small" aria-label="small outlined button group">
                                <ButtonGroup size="small" aria-label="small outlined button group">
                                    <IconButton size="small" disabled={schoolAnnPageIdx === 0} onClick={() => handlePageChange('school', -1)}><ArrowBackIosIcon /></IconButton>
                                    <IconButton size="small" disabled={schoolAnnPageIdx === Math.ceil(schoolAnnouncements.length / MAX_ANN) - 1} onClick={() => handlePageChange('school', 1)}><ArrowForwardIosIcon /></IconButton>
                                </ButtonGroup>
                                </ButtonGroup>
                            </ListSubheader>}
                    >
                        {
                            schoolAnnouncements.slice(schoolAnnPageIdx * MAX_ANN, (schoolAnnPageIdx + 1) * MAX_ANN).map((schoolAnn, idx) => (


                                <ListItem button onClick={() => handleOpenCurrentAnn(schoolAnn)} key={`school-ann-${idx}`} alignItems="flex-start">
                                    <ListItemIcon>
                                        <SchoolIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            schoolAnn.title
                                        }
                                        secondary={
                                            moment(schoolAnn.createdAt).format('MMMM Do YYYY, h:mm a')
                                        }
                                    />
                                </ListItem>

                            ))

                        }


                    </List>

                    <List
                        className={classes.root}
                        subheader={
                            <ListSubheader component="div" style={{display: "flex", justifyContent: "space-between"}}>
                                <span>Class Announcements</span>
                                <ButtonGroup size="small" aria-label="small outlined button group">
                                    <IconButton size="small" disabled={classAnnPageIdx === 0} onClick={() => handlePageChange('class', -1)}><ArrowBackIosIcon /></IconButton>
                                    <IconButton size="small" disabled={classAnnPageIdx === Math.ceil(classAnnouncements.length / MAX_ANN) - 1} onClick={() => handlePageChange('class', 1)}><ArrowForwardIosIcon /></IconButton>
                                </ButtonGroup>
                            </ListSubheader>}
                    >
                        {
                            classAnnouncements.slice(classAnnPageIdx * MAX_ANN, (classAnnPageIdx + 1) * MAX_ANN).map((classAnn, idx) => (


                                <ListItem button onClick={() => handleOpenCurrentAnn(classAnn)} key={`class-ann-${idx}`} alignItems="flex-start">
                                    <ListItemIcon>
                                        <ClassIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            classAnn.title
                                        }
                                        secondary={
                                            moment(classAnn.createdAt).format('MMMM Do YYYY, h:mm a')
                                        }
                                    />
                                </ListItem>

                            ))

                        }


                    </List>

                </Grid>
                {/* Classes */}
                <Grid item xs={12} md={7} lg={8} xl={9}>
                    <Grid spacing={1} align="center" container>

                        {
                            studentInfo.classes.map((classDoc, idx) => (
                                <Grid onClick={() => handleOpenClass(classDoc._id)} key={`class-card-${idx}`} item xs={12} sm={6} md={4} lg={3} >
                                    <Card raised className={classes.card}>
                                        <CardActionArea >
                                            <CardMedia
                                                className={classes.cardMedia}
                                                image="https://builtin.com/sites/default/files/styles/og/public/2019-04/big-data-education.png"
                                                title="Blank"
                                            />
                                            <CardContent>
                                                <Typography gutterBottom variant="h5" component="h2">
                                                    {classDoc.name}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">
                                                    {classDoc.teachers[0].first_name} {classDoc.teachers[0].last_name}
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            ))
                        }

                    </Grid>

                </Grid>

            </Grid>





        </div>

    );
}

export default StudentPortal;
