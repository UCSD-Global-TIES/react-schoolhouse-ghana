import React from "react";
import "../../utils/flowHeaders.min.css";
import "./main.css";
import { Redirect } from "react-router-dom";


function LoginPortal(props) {
    if(props.user) { <Redirect to="/" /> }

    return (
        <div >
            LOGIN PORTAL
        </div>

    );
}

export default LoginPortal;