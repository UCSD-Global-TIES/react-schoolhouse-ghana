import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getQueries, parseTime } from "../../utils/misc";
import API from "../../utils/API";
import { Button, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, Checkbox } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullhorn, faPlus, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { makeStyles, useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    list: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    buttonLink: {
        color: "inherit",
        textDecoration: "none"
    },
    actionButton: {
        margin: theme.spacing(1)
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
    // const [loading, setLoading] = useState(true);

    // TESTING
    const [announcements, setAnnouncements] = useState(testAnnouncements);
    const [loading, setLoading] = useState(false);


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
        // Consider using a table instead!!
        // https://material-ui.com/components/tables/#sorting-amp-selecting
        <div style={{ display: "flex", width: "100%", height: "100%" }}>
            <div style={{ margin: "auto" }}>
                Current Query: {props.location.search ? getQueries(props.location.search).id : "None"}
                <br />
                <br />
                Announcements Editor
                <br />
                <br />
                <Link to={`${props.match.url}?id=123`}>Update Announcement ID #123 </Link>

                <div>
                    <Button
                        variant="contained"
                        style={{ backgroundColor: "#5cb85c", color: "white" }}
                        size="small"
                        className={classes.actionButton}
                        onClick={handleCreate}
                        startIcon={<FontAwesomeIcon icon={faPlus} />}
                    >
                        Add
                    </Button>
                    {
                        selected.length ?
                            <Button
                                variant="contained"
                                color="secondary"
                                size="small"
                                className={classes.actionButton}
                                startIcon={<FontAwesomeIcon icon={faTrash} />}
                                onClick={handleDelete}
                            >
                                Delete ({selected.length})
                            </Button>
                            : ""
                    }
                    {
                        selected.length === 1 ?

                            <Button
                                variant="contained"
                                color="default"
                                size="small"
                                className={classes.actionButton}
                                onClick={handleUpdate}
                                startIcon={<FontAwesomeIcon icon={faEdit} />}
                            >
                                Update
                            </Button>
                            : ""
                    }
                </div>
                {
                    loading ?
                        <> Loading... </>
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
                                                <ListItemText id={labelId} primary={announcement.title} secondary={announcement.last_updated ? `Updated: ${parseTime(announcement.last_updated)}` : `Created: ${parseTime(announcement.date_created)}`} />
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
                            <> No announcements exist yet. Create one!</>
                }



            </div>
        </div>
    )
};

export default AnnouncementsForm;