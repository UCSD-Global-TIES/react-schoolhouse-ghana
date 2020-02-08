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
  Student: ClassViewer,
  Teacher: ClassEditor,
  Admin: ClassEditor
}

function ClassPage(props) {
  const class_id = props.match.params.id;
  const announcements = [
    {
      author: "Author 1",
      content: "Content",
      date: "Jan 1, 2019"
    },
    {
      author: "Author 2",
      content: "Content",
      date: "Jan 1, 2019"
    },
    {
      author: "Author 3",
      content: "Content",
      date: "Jan 1, 2019"
    },
    {
      author: "Author 4",
      content: "Content",
      date: "Jan 1, 2019"
    }
  ];
  
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

  if (props.user.type === "Student" || props.user.type === "Teacher") {
    if(!props.user.profile.classes.includes(class_id)) { return <AccessDenied /> }
  }

  const Component = accountComponents[props.user.type];

  return (
    <Component {...props} class={classInfo} />
  );
}

export default ClassPage;
