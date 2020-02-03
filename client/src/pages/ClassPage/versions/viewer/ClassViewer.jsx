import React from "react";
import "../../../../utils/flowHeaders.min.css";
import "./main.css";

function ClassViewer(props) {

    return (
        <div> CLASS VIEWER: {props.class.name} </div>
    );
}

export default ClassViewer;
