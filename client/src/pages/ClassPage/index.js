
import React from "react";
import ClassPage from './ClassPage.jsx';
import SimpleAnnouncement from '../../components/announcement.js';

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

<SimpleAnnouncement announcement={announcements} />
export default ClassPage;