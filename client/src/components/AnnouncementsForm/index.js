import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getQueries, parseTime } from "../../utils/misc";
import API from "../../utils/API";
import { Alert } from '@material-ui/lab'
import { Snackbar, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, Checkbox, Typography } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullhorn, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import EnhancedListToolbar from "../EnhancedListToolbar";
import "../../utils/flowHeaders.min.css";


const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    list: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    buttonLink: {
        color: "inherit",
        textDecoration: "none"
    },
    actionButton: {
        margin: theme.spacing(1)
    },
    content: {
        width: "90%",
        maxWidth: "700px"
    }
}));


function AnnouncementsForm(props) {
    const testAnnouncements = [
        {
            title: "Title 0",
            content: "Content 0",
            date_created: "123",
            last_updated: "1234"
        },
        {
            title: "Title 1",
            content: "Content 1",
            date_created: "123"
        },
    ];
    const classes = useStyles();
    // const theme = useTheme();
    const [selected, setSelected] = useState([]);
    // const [announcements, setAnnouncements] = useState([]);
    const [currentAlert, setCurrentAlert] = useState({isOpen: false, severity: "", message: ""});
    // const [loading, setLoading] = useState(true);

    // TESTING
    const [announcements, setAnnouncements] = useState(testAnnouncements);
    const [loading, setLoading] = useState(false);

    const handleAlertClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        let tmp = currentAlert;

        tmp.isOpen = false;

        setCurrentAlert({...tmp});
    };

    const handleSelect = value => () => {
        const currentIndex = selected.indexOf(value);
        const newSelected = [...selected];

        if (currentIndex === -1) {
            newSelected.push(value);
        } else {
            newSelected.splice(currentIndex, 1);
        }

        setSelected(newSelected);
    };

    const handleCreate = () => {
        console.log("Creating announcements")

    }

    const handleDelete = () => {
        console.log("Deleting announcements: ", selected.join(" "))
    }

    const handleUpdate = () => {
        console.log("Updating announcement: ", selected[0]);

    }

    useEffect(() => {
        // API.getSchoolAnnouncements(props.user.key)
        //     .then((result) => {
        //         setAnnouncements(result.data);
        //         setLoading(false);
        //     })
    }, []);

    return (
        <>
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={currentAlert.isOpen}
                autoHideDuration={6000}
                onClose={handleAlertClose}
            >
                <Alert onClose={handleAlertClose} severity={currentAlert.severity}>
                    {currentAlert.message}
                </Alert>
            </Snackbar>
            <div style={{ display: "flex", width: "100%", height: "100%" }}>
                <div style={{ margin: "auto" }} className={classes.content}>
                    {/* Current Query: {props.location.search ? getQueries(props.location.search).id : "None"}
                <br />
                <br />
                Announcements Editor
                <br />
                <br />
                <Link to={`${props.match.url}?id=123`}>Update Announcement ID #123 </Link> */}

                    <>
                    {/* https://material-ui.com/components/dialogs/ */}
                        <EnhancedListToolbar title={"Announcements"} numSelected={selected.length} handleCreate={handleCreate} handleUpdate={handleUpdate} handleDelete={handleDelete} />

                        {
                            loading ?
                                <div style={{ display: "flex", marginTop: "2rem" }}>
                                    <div style={{ margin: "auto", padding: "3rem" }}>
                                        <Typography className="flow-text" style={{ color: "grey" }} variant="h5">Loading...</Typography>
                                        <p style={{ textAlign: "center", color: "grey" }}><FontAwesomeIcon icon={faSpinner} spin size="5x" /></p>
                                    </div>
                                </div>

                                :

                                announcements.length ?
                                    <List className={classes.list}>

                                        {
                                            announcements.map((announcement, idx) => {
                                                const labelId = `announcement-${idx}`;

                                                return (
                                                    <ListItem key={labelId} role={undefined} dense button onClick={handleSelect(idx)}>
                                                        <ListItemIcon>
                                                            <Checkbox
                                                                edge="start"
                                                                checked={selected.indexOf(idx) !== -1}
                                                                tabIndex={-1}
                                                                disableRipple
                                                                inputProps={{ 'aria-labelledby': labelId }}
                                                            />
                                                        </ListItemIcon>
                                                        <ListItemText id={labelId} primary={announcement.title} secondary={announcement.last_updated ? `Updated: ${parseTime(announcement.last_updated, true)}` : `Created: ${parseTime(announcement.date_created, true)}`} />
                                                        <ListItemSecondaryAction>
                                                            {/* <IconButton edge="end" aria-label="comments"> */}
                                                            <FontAwesomeIcon icon={faBullhorn} />
                                                            {/* </IconButton> */}
                                                        </ListItemSecondaryAction>
                                                    </ListItem>
                                                );
                                            })
                                        }
                                    </List>

                                    :
                                    <div style={{ display: "flex", marginTop: "2rem" }}>
                                        <div style={{ margin: "auto", padding: "3rem" }}>
                                            <Typography className="flow-text" style={{ color: "grey" }} variant="h5">No announcements exist yet.</Typography>
                                            <p style={{ textAlign: "center", color: "grey" }}><FontAwesomeIcon icon={faBullhorn} size="5x" /></p>
                                        </div>
                                    </div>
                        }
                    </>



                </div>
            </div>
        </>
    )
};

export default AnnouncementsForm;