import React, { useState, useEffect } from "react";
import "../../../../utils/flowHeaders.min.css";
import "./main.css";
import API from "../../../../utils/API";

function ClassViewer(props) {

    const [classInfo, setClassInfo] = useState({});

    useEffect(() => {
        API.getClass(props.match.params.cid, props.user.key)
            .then((result) => {
                setClassInfo(result.data);
        })
    }, [])

    return (
        <div style={{display: "flex", width: "100%", height: "100vh"}}>  
        <div style={{margin: "auto"}}> CLASS VIEWER: {props.class.name} </div>    
        </div>
    );
}

export default ClassViewer;
