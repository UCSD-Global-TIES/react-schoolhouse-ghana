import React, { useEffect, useState } from "react";
import GradebookNavbar from "../../components/Gradebook/GradebookNavbar";
import GradebookTable  from "../../components/Gradebook/GradebookTable";
import GradebookForm   from "../../components/Gradebook/GradebookForm";
import API             from "../../utils/API";

const GradebookPage = ({ match, user }) => {
  const subjectId = match.params.subjectId;
  const [gradebookData, setGradebookData] = useState([]);
  const [subjectInfo, setSubjectInfo]   = useState({ name: "" });
  const isStudent = user?.type === "Student";

  // build teacherName…
  const { profile } = user || {};
  const teacherName = profile
    ? `${profile.first_name} ${profile.last_name}`
    : user.name;

  // fetch subject name…
  useEffect(() => {
    if (!subjectId || !user?.key) return;
    API.getSubject(subjectId, user.key)
      .then(({ data }) => setSubjectInfo({ name: data.name }))
      .catch(console.error);
  }, [subjectId, user?.key]);

  // fetch gradebook…
  useEffect(() => {
    if (!subjectId || !user?.key) return;
    API.getGradebook(subjectId, user.key)
      .then(({ data }) => setGradebookData(data))
      .catch(console.error);
  }, [subjectId, user?.key]);

  // save handler
  const saveGradebook = () => {
    API.saveGradebook(subjectId, gradebookData, user.key)
      .then(() => alert("✅ Gradebook saved!"))
      .catch(console.error);
  };

  // derive gradeLevel
  const gradeLevel = gradebookData[0]?.gradeId?.level ?? "–";

  // filter for student…
  const displayedData = isStudent
    ? gradebookData.filter((r) => r.studentId === user.id)
    : gradebookData;

  return (
    <div>
      <GradebookNavbar
        subjectName={subjectInfo.name}
        teacherName={teacherName}
        gradeLevel={gradeLevel}
      />

      <GradebookTable
        data={displayedData}
        updateData={setGradebookData}
        readOnly={isStudent}
      />

      {!isStudent && (
        <>
          <GradebookForm
            onSubmit={(newRow) =>
              setGradebookData((prev) => [
                ...prev,
                { ...newRow, subjectId, gradeId: newRow.gradeId || null, grades: [] },
              ])
            }
          />
          <button onClick={saveGradebook}>Save Gradebook</button>
        </>
      )}
    </div>
  );
};

export default GradebookPage;
