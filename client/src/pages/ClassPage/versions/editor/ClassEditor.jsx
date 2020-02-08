import React from "react";
import "../../../../utils/flowHeaders.min.css";
import "./main.css";
import SimpleAnnouncement from '../../../../components/announcement';

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
function ClassEditor(props) {

    
    return (
        <div style={{display: "flex", width: "100%", height: "100vh"}}>  
        <div style={{margin: "auto"}}> 
                {
                    announcements.map((announcement, idx) => (
                        <SimpleAnnouncement announcement={announcement} key={`ann-${idx}`} />
                    ))
                }
        CLASS EDITOR: {props.class.name} 
        </div>
    </div>    
    );
}

export default ClassEditor;
