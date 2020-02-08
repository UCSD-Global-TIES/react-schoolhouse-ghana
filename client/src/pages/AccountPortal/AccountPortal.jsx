import React from "react";
import "../../utils/flowHeaders.min.css";
import "./main.css";

import StudentPortal from "./versions/student/StudentPortal.jsx";
import TeacherPortal from "./versions/teacher/TeacherPortal.jsx";
import AdminPortal from "./versions/admin/AdminPortal.jsx";

const accountComponents = {
    Student: StudentPortal,
    Teacher: TeacherPortal,
    Admin: AdminPortal
}

function AccountPortal(props) {
    const Component = accountComponents[props.user.type];
    console.log(props.user);

    return (
        <Component {...props} />
    );
}

export default AccountPortal;
