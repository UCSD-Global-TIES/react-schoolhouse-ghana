import axios from "axios";
// import encrypt from "./encrypt";

// ROUTES UNSECURED
// CONVERT ALL API FUNCTIONS SO YOU PASS IN VARIABLES NOT A OBJECT
export default {
  // SUBJECT ANNOUNCEMENTS
  // ---------------------------------------------------------------
  // Create an 'Announcement' -> Add new 'Announcement' to 'Subject' announcements
  addSubjectAnnouncement: function (subject_id, title, content, files, authorName, key) {
    const config = {
      'Authorization': key
    };
    const newA = {
      title,
      authorName,
      content,
      files
    };
    return axios.post(`/api/subject/${subject_id}/ann`, newA, {
      headers: config
    }); // SECURE
  },
  // Delete an 'Announcement' -> Pull 'Announcement' from 'Subject' announcements
  deleteSubjectAnnouncement: function (subject_id, ann_id, key) {
    const config = {
      'Authorization': key
    };
    return axios.delete(`/api/subject/${subject_id}/ann/${ann_id}`, {
      headers: config
    }); // SECURE
  },
  // FILES
  // ---------------------------------------------------------------
  // https://programmingwithmosh.com/javascript/react-file-upload-proper-server-side-nodejs-easy/

  // Create a 'File'
  addFile: function (file, nickname, type, path, key) {
    const config = {
      'Authorization': key
    };
    const fileData = new FormData();
    fileData.append('file', file);
    fileData.append('name', nickname);
    fileData.append('type', type);
    fileData.append('path', path);

    return axios.post(`/api/file`, fileData, {
      headers: config
    }); // SECURE
  },
  // Delete a 'File'
  deleteFile: function (file_id, key) {
    const config = {
      'Authorization': key
    };
    return axios.delete(`/api/file/${file_id}`, {
      headers: config
    }); // SECURE
  },
  // Update a 'File'
  updateFile: function (file_id, nickname, key) {
    const config = {
      'Authorization': key
    };
    const newF = {
      nickname,
      last_updated: Date.now()
    }
    return axios.put(`/api/file/${file_id}`, newF, {
      headers: config
    }); // SECURE
  },
  // SUBJECTS
  // ---------------------------------------------------------------
  // Get a specified subject
  getSubject: function (subject_id, key) {
    const config = {
      'Authorization': key
    };
    return axios.get(`/api/subject/${subject_id}`, {
      headers: config
    }); // SECURE
  },
  // Create a 'Subject' -> Add 'Subject' to 'Grade' subjects
  addSubject: function (name, grade_id, gradePath, key) {
    const config = {
      'Authorization': key
    };
    const newC = {
      name,
      grade: grade_id
    };

    return axios.post(`/api/subject`, {
      document: newC,
      path: gradePath
    }, {
      headers: config
    }); // SECURE
  },
  // Update a 'Subject'
  updateSubject: function (subject_id, name, grade_id, files, key) {
    const config = {
      'Authorization': key
    };

    const newC = {
      name,
      grade: grade_id,
      files
    };
    return axios.put(`/api/subject/${subject_id}`, newC, {
      headers: config
    }); // SECURE
  },
  // Delete a 'Subject' -> Pull 'Subject' from 'Grade' subjects
  deleteSubject: function (subject_id, key) {
    const config = {
      'Authorization': key
    };
    return axios.delete(`/api/subject/${subject_id}`, {
      headers: config
    }); // SECURE
  },
  // ANNOUNCEMENTS
  // ---------------------------------------------------------------
  // Get all 'Announcement' documents that are not 'private'
  getSchoolAnnouncements: function (key) {
    const config = {
      'Authorization': key
    };
    return axios.get(`/api/general/ann`, {
      headers: config
    }); // SECURE
  },
  // Create a public 'Announcement'
  addSchoolAnnouncement: function (title, content, authorName, key) {
    const config = {
      'Authorization': key
    };
    let doc = {
      title,
      content,
      authorName,
      files,
      private: false
    };
    return axios.post(`/api/general/ann`, doc, {
      headers: config
    }); // SECURE
  },
  // Delete a public 'Announcement'
  deleteSchoolAnnouncement: function (ann_id, key) {
    const config = {
      'Authorization': key
    };
    return axios.delete(`/api/general/ann/${ann_id}`, {
      headers: config
    }); // SECURE
  },
  // Update ANY 'Announcement'
  updateAnnouncement: function (ann_id, title, content, files, key) {
    const config = {
      'Authorization': key
    };
    const newA = {
      title,
      content,
      files,
      last_updated: Date.now()
    }
    return axios.put(`/api/general/ann/${ann_id}`, newA, {
      headers: config
    }); // SECURE
  },
  // GRADES
  // ---------------------------------------------------------------
  // Get all 'Grade' documents
  getGrades: function (key) {
    const config = {
      'Authorization': key
    };
    return axios.get(`/api/grade`, {
      headers: config
    }); // SECURE
  },
  // Get a 'Grade'
  getGrade: function (grade_id, key) {
    const config = {
      'Authorization': key
    };
    return axios.get(`/api/grade/${grade_id}`, {
      headers: config
    }); // SECURE
  },
  // Create a 'Grade'
  addGrade: function (level, key) {
    const config = {
      'Authorization': key
    };
    const newG = {
      level
    };
    return axios.post(`/api/grade`, newG, {
      headers: config
    }); // SECURE 
  },
  // Delete a 'Grade'
  deleteGrade: function (grade_id, key) {
    const config = {
      'Authorization': key
    };
    return axios.delete(`/api/grade/${grade_id}`, {
      headers: config
    }); // SECURE
  },
  // GRADE MEMBERS
  // ---------------------------------------------------------------
  // Add a 'Student' to 'Grade' students 
  addStudent: function (grade_id, sid, key) {
    const config = {
      'Authorization': key
    };
    return axios.post(`/api/grade/${grade_id}/student/${sid}`, {
      headers: config
    }); // SECURE
  },
  // Remove a 'Student' from 'Grade' students
  deleteStudent: function (grade_id, sid, key) {
    const config = {
      'Authorization': key
    };
    return axios.delete(`/api/grade/${grade_id}/student/${sid}`, {
      headers: config
    }); // SECURE
  },
  // Add a 'Teacher' to 'Grade' teachers 
  addTeacher: function (grade_id, tid, key) {
    const config = {
      'Authorization': key
    };
    return axios.post(`/api/grade/${grade_id}/teacher/${tid}`, {
      headers: config
    }); // SECURE
  },
  // Remove a 'Teacher' from 'Grade' teachers
  deleteTeacher: function (grade_id, tid, key) {
    const config = {
      'Authorization': key
    };
    return axios.delete(`/api/grade/${grade_id}/teacher/${tid}`, {
      headers: config
    }); // SECURE
  },
  // Add a 'Subject' to 'Grade' subjects 
  addSubject: function (grade_id, sid, key) {
    const config = {
      'Authorization': key
    };
    return axios.post(`/api/grade/${grade_id}/subject/${sid}`, {
      headers: config
    }); // SECURE
  },
  // Remove a 'Subject' from 'Grade' subjects
  deleteSubject: function (grade_id, sid, key) {
    const config = {
      'Authorization': key
    };
    return axios.delete(`/api/grade/${grade_id}/subject/${sid}`, {
      headers: config
    }); // SECURE
  },

  // ACCOUNTS
  // ---------------------------------------------------------------
  // Gets 'Account' profile matching the specified username and password
  verifyAccount: function (username, password) {
    const config = {
      'Authorization': JSON.stringify({
        username,
        password
      })
    };
    return axios.get(`/api/verify/account`, {
      headers: config
    });
  },
  // Verifies there is a current user session
  verifySession: function () {
    return axios.get(`/api/verify/session`);
  },
  // Verifies if the database is empty (checks for existence of user accounts)
  // If so, create a new user account and return credentials
  verifyInitialization: function () {
    return axios.get(`/api/verify/database`);
  },
  // Seeds the database with default
  seedDatabase: function () {
    return axios.post(`/api/verify/database`);
  },
  // Checks load speed of the website
  checkLoadSpeed: function () {
    return axios.get(`/api/verify/load`)
  },
  // Destroys the current user session
  destroySession: function () {
    return axios.delete(`/api/verify/session`);
  },
  // Add an 'Account' of ANY type -> Add 'Account' to 'Grade'
  addAccount: function (first_name, last_name, type, grade_id, key) {
    const config = {
      'Authorization': key
    };
    let newA = {
      first_name,
      last_name,
      type
    };
    if (gradeID) newA.grade = grade_id;

    return axios.post(`/api/account`, newA, {
      headers: config
    }); // SECURE 
  },
  // Updates 'Account' name 
  updateAccountName: function (acc_id, first_name, last_name, key) {
    const config = {
      'Authorization': key
    };
    return axios.put(`/api/account/${acc_id}?field=name`, {
      first_name,
      last_name
    }, {
      headers: config
    }); // SECURE
  },
  // Updates 'Account' password
  updateAccountPassword: function (acc_id, oldPassword, newPassword, key) {
    const config = JSON.stringify({
      'Authorization': {
        key,
        oldPassword,
        newPassword
      }
    });

    return axios.put(`/api/account/${acc_id}?field=password`, {}, {
      headers: config
    }); // SECURE
  },
  // Delete 'Account' and associated profile
  deleteAccount: function (acc_id, key) {
    const config = {
      'Authorization': key
    };
    return axios.delete(`/api/account/${acc_id}`, {
      headers: config
    }); // SECURE
  }
};