import React from "react";
import "../../utils/flowHeaders.min.css";
import "./main.css";

import UserPortal from "./versions/user/UserPortal.jsx";
import { Redirect } from "react-router-dom";

const AdminRedirect = () => <Redirect to="/edit" />;
const TeacherRedirect = () => <Redirect to="/teacher"/>

const accountComponents = {
    Student: UserPortal,
    Teacher: TeacherRedirect,
    Admin: AdminRedirect
}

function AccountPortal(props) {
    const Component = accountComponents[props.user.type];

    return (
        <Component {...props} />
    );
}

export default AccountPortal;
