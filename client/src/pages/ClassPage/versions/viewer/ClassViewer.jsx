import React, { useState, useEffect } from "react";
import "../../../../utils/flowHeaders.min.css";
import "./main.css";
import API from "../../../../utils/API";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import AnnouncementView from "../../../../components/Announcement";
import SimpleResource from "../../../../components/Resource";
import Pagination from "@material-ui/lab/Pagination";
import clsx from "clsx";

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: "center",
        color: theme.palette.text.secondary
    },
    contain: {
        backgroundColor: "#F9F9F9"
    },
    pagination: {
        "& > *": {
            marginTop: theme.spacing(2)
        }
    },
    section: {
        backgroundColor: "#F0F0F0",
        padding: 20
    }
}));

// B. COMPONENT CODE
const announcements = [
    {
        author: "Author 1",
        content: "Content",
        date: "Jan 1, 2019"
    },
    {
        author: "Author 2",
        content: "Content",
        date: "Jan 1, 2019"
    },
    {
        author: "Author 3",
        content: "Content",
        date: "Jan 1, 2019"
    },
    {
        author: "Author 4",
        content: "Content",
        date: "Jan 1, 2019"
    }
];
const resources = [
    {
        title: "Resource 1",
        content: "description",
        date: "Jan 1, 2019"
    },
    {
        title: "Resource 2",
        content: "description",
        date: "Jan 2, 2019"
    },
    {
        title: "Resourc 3",
        content: "description",
        date: "Jan 3, 2019"
    },
    {
        title: "Resource 4",
        content: "description",
        date: "Jan 4, 2019"
    }
];

function ClassViewer(props) {

    const [classInfo, setClassInfo] = useState({});

    const MAX_ITEMS = 2;
    const classes = useStyles();
    const [pageAnnouncements, setPageAnnouncements] = React.useState(
        announcements.slice(0, MAX_ITEMS)
    );

    const [page, setPage] = React.useState(1);
    const handleChange = (event, value) => {
        setPage(value);

        if (MAX_ITEMS * value >= announcements.length)
            setPageAnnouncements(announcements.slice((value - 1) * MAX_ITEMS));
        else
            setPageAnnouncements(
                announcements.slice((value - 1) * MAX_ITEMS, value * MAX_ITEMS)
            );
    };

    useEffect(() => {
        setTimeout(() => {
            const testClass = {
                "_id" : "5e46ded505551964a01e9cc0",
                "class_id" : "1",
                "name" : "math",
                "path" : "1",
                "teachers" : [],
                "students" : [],
                "files" : [],
                "grade" : 1,
                "announcements" : []
            }
            setClassInfo(testClass);

        }, 1000)
        // API.getClass(props.match.params.id, props.user.key)
        //     .then((result) => {
        //         setClassInfo(result.data);
            
        //     })
    }, [])

    return (
        <div style={{ display: "flex", width: "100%", height: "100vh" }}>
            <div style={{ margin: "auto" }}> CLASS VIEWER: {props.class.name} </div>
            <Grid container spacing={6}>
                <Grid item xs={12} md={4}>
                    <Box className={classes.section}>
                        <Grid className={classes.announcement} container spacing={2}>
                            {pageAnnouncements.map((announcement, idx) => (
                                <Grid key={`a-${idx}`} item xs={12}>
                                    <AnnouncementView announcement={announcement} />
                                </Grid>
                            ))}
                        </Grid>

                        <div className={classes.announcement}>
                            <Pagination
                                count={Math.ceil(announcements.length / MAX_ITEMS)}
                                page={page}
                                onChange={handleChange}
                            />
                        </div>
                    </Box>
                </Grid>

                <Grid item xs={12} md={8} spacing={3}>
                    <Box className={classes.section}>
                        <Grid className={classes.resource} container spacing={2}>
                            {resources.map((resource, idx) => (
                                <Grid key={`r-${idx}`} item xs={12} sm={6} lg={4}>
                                    <SimpleResource resource={resource} />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        </div>
    );
}



export default ClassViewer;
