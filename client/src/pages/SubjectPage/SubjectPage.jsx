import React, {
  useEffect,
  useState
} from "react";

import "../../utils/flowHeaders.min.css";
import "./main.css";
import API from "../../utils/API";

import SubjectViewer from "./versions/viewer/SubjectViewer.jsx";
import SubjectEditor from "./versions/editor/SubjectEditor.jsx";
import AccessDenied from "../../components/AccessDenied";

const accountComponents = {
  Student: SubjectViewer,
  Teacher: SubjectEditor,
  Admin: SubjectViewer
}

function SubjectPage(props) {
  const subject_id = props.match.params.id;

  const [subjectInfo, setSubjectInfo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve 'Subject' document
    API
      .getSubject(subject_id, props.user.key)
      .then((subjectDoc) => {
        setSubjectInfo(subjectDoc);
        setLoading(false);
      })

  }, []);

  if (loading) {
    return (
      <div className="App text-center">
        {/* Replace with subject page skeleton */}
        Loading
      </div>
    )
  }

  if (props.user.type === "Student" || props.user.type === "Teacher") {
    if (!props.user.profile.grade !== subjectInfo.grade) { return <AccessDenied /> }
  }

  const Component = accountComponents[props.user.type];

  return (
    <Component {...props} subject={subjectInfo} />
  );
}

export default SubjectPage;
