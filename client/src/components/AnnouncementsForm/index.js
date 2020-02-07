import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getQueries } from "../../utils/misc";
import API from "../../utils/API";

function AnnouncementsForm(props) {

    useEffect(() => {
        API.getSchoolAnnouncements(props.user.key)
            .then((result) => {
                console.log(result.data);
        })
    }, []);

    return (
        <div style={{ display: "flex", width: "100%", height: "100%" }}>
            <div style={{ margin: "auto" }}>
                Current Query: {props.location.search ? getQueries(props.location.search).id : "None"}
                <br />
                <br />
                Announcements Editor
                <br />
                <br />
                <Link to={`${props.match.url}?id=123`}>Update Announcement ID #123 </Link>

            </div>
        </div>
    )
};

export default AnnouncementsForm;