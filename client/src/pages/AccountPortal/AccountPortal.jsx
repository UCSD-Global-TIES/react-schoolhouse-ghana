import React from "react";
import "../../utils/flowHeaders.min.css";
import "./main.css";

// import UserPortal from "./versions/user/UserPortal.jsx";
import { Redirect } from "react-router-dom";

const AdminRedirect = () => <Redirect to="/edit" />;
const UserRedirect = () => <Redirect to="/user" />
const TeacherRedirect = () => <Redirect to="/teacher" />

const accountComponents = {
    Student: UserRedirect,
    Teacher: TeacherRedirect,
    Admin: AdminRedirect
}

function AccountPortal(props) {
    if (!props.user) {
        // If user is missing, redirect to login
        return <Redirect to="/login" />;
    }

    if (console && console.debug) console.debug("[AccountPortal] props.user:", props.user);
    const Component = accountComponents[props.user.type];

    if (!Component) {
        // Fallback: unknown type -> NoMatch
        return <Redirect to="/" />;
    }

    return <Component {...props} />;
}

export default AccountPortal;
