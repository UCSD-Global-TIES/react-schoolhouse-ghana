import React from "react";
import "../../../../utils/flowHeaders.min.css";
import "./main.css";

function ClassEditor(props) {

    return (
        <div style={{display: "flex", width: "100%", height: "100vh"}}>  
        <div style={{margin: "auto"}}> CLASS EDITOR: {props.class.name} </div>
    </div>    
    );
}

export default ClassEditor;
