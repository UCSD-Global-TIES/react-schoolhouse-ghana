import React, { useEffect, useState } from "react";
import API from "../../utils/API";
import EnrolledClasses from "../../components/EnrolledClasses";
import PageSpinner from "../../components/PageSpinner";
import { Typography } from "@material-ui/core";

function ClassesList(props) {
  const { user } = props;
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    if (!user) return;

    API.getSubjects(user.key)
      .then((res) => {
        const allSubjects = res.data || [];
        // By default assume server returned correctly-scoped subjects.
        // Apply client-side filtering only when the subjects still contain
        // explicit "teachers" or "students" arrays (e.g., server returned all).
        let filtered = allSubjects;

        const profileId = user.profile && (user.profile._id || user.profile);

        if (Array.isArray(allSubjects) && allSubjects.length) {
          const sample = allSubjects[0];

          // If subjects include teachers array, filter by teacher membership when user is Teacher
          if (user.type === "Teacher" && Array.isArray(sample.teachers)) {
            filtered = allSubjects.filter((s) =>
              Array.isArray(s.teachers) && s.teachers.some((t) => {
                const tid = t && (t._id || t);
                return String(tid) === String(profileId);
              })
            );
          }

          // If subjects include students array, filter by student membership when user is Student
          if (user.type === "Student" && Array.isArray(sample.students)) {
            filtered = allSubjects.filter((s) =>
              Array.isArray(s.students) && s.students.some((st) => {
                const sid = st && (st._id || st);
                return String(sid) === String(profileId);
              })
            );
          }
        }

        setSubjects(filtered);
      })
      .catch((err) => {
        console.error("Failed to load subjects", err);
        setSubjects([]);
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return <Typography>Please log in</Typography>;
  if (loading) return <PageSpinner />;

  return (
    <div style={{ padding: "2rem" }}>
      <Typography variant="h2">My Classes</Typography>
      {subjects && subjects.length ? (
        <EnrolledClasses
          subjects={subjects}
          status={"active"}
          title={"CURRENT SUBJECTS"}
          editable={false}
          gradeLabel={""}
        />
      ) : (
        <div style={{ marginTop: "1.5rem" }}>
          <Typography variant="body1">
            {user && user.type === "Student"
              ? "You are not enrolled in any classes yet. If you believe this is incorrect, contact your administrator or teacher."
              : "No classes found. If you are a teacher, you may not be assigned to any classes yet."}
          </Typography>
        </div>
      )}
    </div>
  );
}

export default ClassesList;
