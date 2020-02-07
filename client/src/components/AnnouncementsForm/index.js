import React from "react";
import { Link } from "react-router-dom";
import { getQueries } from "../../utils/misc"

const AnnouncementsForm = (props) => (
    <div style={{ display: "flex", width: "100%", height: "100%" }}>      
        <div style={{ margin: "auto" }}>
            Current Query: {props.location.search ? getQueries(props.location.search).id: "None"}
            <br />
            <br />
            Announcements Editor
            <br />
            <br />
            <Link to={`${props.match.url}?id=123`}>Update Announcement ID #123 </Link>

        </div>
    </div>    
);

export default AnnouncementsForm;