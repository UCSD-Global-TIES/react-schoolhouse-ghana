import React from "react";
import "../../utils/flowHeaders.min.css";
import "./main.css";

import UserPortal from "./versions/user/UserPortal.jsx";
import { Redirect } from "react-router-dom";
// import AdminPortal from "./versions/admin/AdminPortal.jsx";

const AdminRedirect = () => <Redirect to="/edit" />;

const accountComponents = {
    Student: UserPortal,
    Teacher: UserPortal,
    Admin: AdminRedirect
}

function AccountPortal(props) {
    const Component = accountComponents[props.user.type];

    return (
        <Component {...props} />
    );
}

export default AccountPortal;
