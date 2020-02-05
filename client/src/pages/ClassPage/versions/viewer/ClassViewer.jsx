import React from "react";
import "../../../../utils/flowHeaders.min.css";
import "./main.css";

function ClassViewer(props) {

    return (
        <div style={{display: "flex", width: "100%", height: "100vh"}}>  
        <div style={{margin: "auto"}}> CLASS VIEWER: {props.class.name} </div>
    </div>        );
}

export default ClassViewer;
