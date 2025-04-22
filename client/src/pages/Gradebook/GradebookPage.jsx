import React, { useEffect, useState } from "react";
import GradebookNavbar from "../../components/Gradebook/GradebookNavbar";
import GradebookTable from "../../components/Gradebook/GradebookTable";
import GradebookForm from "../../components/Gradebook/GradebookForm";
import API from "../../utils/API";

const GradebookPage = ({ match, user }) => {
  const subjectId = match.params.subjectId;
  const [gradebookData, setGradebookData] = useState([]);
  const isStudent = user?.type === "Student";

  const filteredData = isStudent
    ? gradebookData.filter((student) => student.studentName === user.name)
    : gradebookData;


  // ✅ Fetch saved grades on page load
  useEffect(() => {
    console.log("🔹 Loading Gradebook...");
    console.log("📌 Subject ID:", subjectId);
    console.log("📌 User Key:", user?.key);

    if (!subjectId || !user?.key) {
      console.error("❌ subjectId or user.key is missing!");
      return;
    }

    API.getGradebook(subjectId, user.key)
      .then((res) => {
        console.log("✅ Gradebook Loaded:", res.data);
        setGradebookData(res.data);
      })
      .catch((err) => {
        console.error("❌ Error loading grades:", err);
      });
  }, [subjectId, user]);

  // ✅ Save gradebook data
  const saveGradebook = () => {
    console.log("Saving gradebook:", gradebookData);
    API.saveGradebook(subjectId, gradebookData)
      .then(() => alert("Gradebook saved!"))
      .catch((err) => console.error("Error saving grades:", err));
  };

  return (
    <div>
      <GradebookNavbar />
      <h1>Gradebook</h1>
      <GradebookTable
        data={filteredData}
        updateData={setGradebookData}
        readOnly={isStudent}
      />

      {!isStudent && (
        <>
          <GradebookForm
            onSubmit={(newStudent) =>
              setGradebookData([...gradebookData, { ...newStudent, grades: [] }])
            }
          />
          <button onClick={saveGradebook}>Save Gradebook</button>
        </>
      )}

    </div>
  );
};

export default GradebookPage;
