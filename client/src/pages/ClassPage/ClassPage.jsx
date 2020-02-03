import React, {
  useEffect,
  useState
} from "react";

import "../../utils/flowHeaders.min.css";
import "./main.css";
import API from "../../utils/API";

import ClassViewer from "./versions/viewer/ClassViewer.jsx";
import ClassEditor from "./versions/editor/ClassEditor.jsx";
import AccessDenied from "../../components/AccessDenied";

const accountComponents = {
  student: ClassViewer,
  teacher: ClassEditor,
  admin: ClassEditor
}

function ClassPage(props) {
  const class_id = props.match.params.id;
  
  const [classInfo, setClassInfo] = useState({name: "Linear Algebra"});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // API.getClass(class_id, key)
    //   .then((user) => {
    //     if (user.data) setClassInfo(user);
    //     setLoading(false);
    //   })

  }, []);

  // if (loading) {
  //   return (
  //     <div className="App text-center">
  //       Loading
  //     </div>
  //   )
  // }

  if (props.user.type === "student" || props.user.type === "teacher") {
    if(!props.user.classes.includes(class_id)) { return <AccessDenied /> }
  }

  const Component = accountComponents[props.user.type];

  return (
    <Component {...props} class={classInfo} />
  );
}

export default ClassPage;
