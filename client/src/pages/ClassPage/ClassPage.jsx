import React from "react";
import "../../utils/flowHeaders.min.css";
import "./main.css";

import ClassViewer from "./versions/viewer/ClassViewer.jsx";
import ClassEditor from "./versions/editor/ClassEditor.jsx";
import AccessDenied from "../../components/AccessDenied";

const accountComponents = {
  student: ClassViewer,
  teacher: ClassEditor,
  admin: ClassEditor
}

function ClassPage(props) {
  
  if (props.user.type === "student" || props.user.type === "teacher") {
    const class_id = props.match.params.id;
    if(!props.user.classes.includes(class_id)) { return <AccessDenied /> }
  }

  const Component = accountComponents[props.user.type];

  return (
    <Component {...props} />
  );
}

export default ClassPage;
