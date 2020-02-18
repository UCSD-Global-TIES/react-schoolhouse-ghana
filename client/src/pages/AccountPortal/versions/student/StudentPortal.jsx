import React, { useEffect, useState } from "react";
import "../../../../utils/flowHeaders.min.css";
import "./main.css";

function StudentPortal(props) {
    // HOOKS 
    // Stores this student's information
    const [studentInfo, setStudentInfo] = useState({});
    // Stores current school announcements
    const [schoolAnnouncements, setSchoolAnnouncements] = useState([]);
    const [classAnnouncements, setClassAnnouncements] = useState([]);

    // If loading, show loading screen
    const [loading, setLoading] = useState(true);
    // Stores index of current announcement; if null, close ann. modal
    const [currentAnnouncementIdx, setCurrentAnnouncementIdx] = useState(null);

    const testStudent = {
        "first_name": "Neve",
        "last_name": "Foresti",
        "grade": 2,
        "classes": [
            {
                name: "Math",
                _id: "1",
                announcements: [
                    {
                        title: "I am the first 'Math' announcement",
                        content: "Look at meee",
                        createdAt: 1581990766 
                    },
                    {
                        title: "I am the second 'Math' announcement",
                        content: "Look at meee",
                        createdAt: 1581990766 
                    }
                ]
            },
            {
                name: "English",
                _id: "2",
                announcements: [
                    {
                        title: "I am the first 'English' announcement",
                        content: "Look at meee",
                        createdAt: 1581990766 
                    },
                    {
                        title: "I am the second 'English' announcement",
                        content: "Look at meee",
                        createdAt: 1581990766 
                    }
                ]
            }
        ]
    }

const testSchoolAnnouncements = [
    {
        title: "I am the first school announcement",
        content: "Look at meee",
        createdAt: 1581990766 
    },
    {
        title: "I am the second school announcement",
        content: "Look at meee",
        createdAt: 1581990766 
    }
]

    useEffect(() => {
        setTimeout(() => {
            // Get & set student info
            setStudentInfo(testStudent);

            // Get & Set school announcements
            setSchoolAnnouncements(testSchoolAnnouncements);

            let classAnnList = []
            for(const classDoc of testStudent.classes) {
                classAnnList.push(classDoc.announcements)
            }
            
            // Get & Set Class announcements
            setClassAnnouncements(classAnnList);

            // Set loading false, so the loading screen goes away
            setLoading(false);

        }, 1000)

    }, [])

    if(loading) {
        return (<> Loading </>)
    }

    return (
        <div style={{display: "flex", width: "100%", height: "100vh"}}>  
            {/* <div style={{margin: "auto"}}> STUDENT PORTAL </div> */}


        {
            schoolAnnouncements.map((schoolAnn, idx) => (

                <>
                {/* School announcement component */}
                {JSON.stringify(schoolAnn)}
                </>
            ))
  
        }

        {
            classAnnouncements.map((classAnn, idx) => (

                <>
                {/* Class announcement component */}
                {JSON.stringify(classAnn)}
                </>
            ))
  
        }

        {
            studentInfo.classes.map((classDoc, idx) => (

                <>
                {/* Class component */}
                {JSON.stringify(classDoc)}
                </>
            ))
        }



        </div>    

    );
}

export default StudentPortal;
