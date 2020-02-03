import React from "react";
import "../../utils/flowHeaders.min.css";
import "./main.css";
import { Redirect } from "react-router-dom";
import API from "../../utils/API";


function LoginPortal(props) {
    if(props.user) { return <Redirect to="/" /> }

    return (
        <div >
            LOGIN PORTAL
        </div>

    );
}

export default LoginPortal;