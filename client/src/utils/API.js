import axios from "axios";
// import encrypt from "./encrypt";

// CONVERT ALL API FUNCTIONS SO YOU PASS IN VARIABLES NOT A OBJECT
export default {
  // SUBJECT ANNOUNCEMENTS
  // ---------------------------------------------------------------
  // Create an 'Announcement' -> Add new 'Announcement' to 'Subject' announcements (if private)
  addAnnouncement: function (newA, key, user) {
    const config = {
      'Authorization': key
    };

    // Add author name
    newA.authorName = `${user.first_name} ${user.last_name}`

    if (newA.private && newA.subject) {
      return axios.post(`/api/subject/${newA.subject}/ann`, newA, {
        headers: config
      }); // SECURE
    } else {
      return axios.post(`/api/general/ann`, newA, {
        headers: config
      }); // SECURE
    }

  },
  // // Get all 'File' documents
  getFiles: function (key) {
    const config = {
      'Authorization': key
    };
    return axios.get(`/api/file`, {
      headers: config
    }); // SECURE
  },
  // Get a 'File'
  getFile: function (file_id, key) {
    const config = {
      'Authorization': key
    };
    return axios.get(`/api/file/${file_id}`, {
      headers: config
    }); // SECURE
  },
  // // Delete a 'File'
  deleteFiles: function (file_id_list, key) {
    const config = {
      'Authorization': key
    };

    const promises = [];

    for (const file_id of file_id_list) {
      promises.push(axios.delete(`/api/file/${file_id}`, {
        headers: config
      })) // SECURE
    }

    return Promise.all(promises);
  },
  // // Update a 'File'
  updateFile: function (newF, key) {
    const config = {
      'Authorization': key
    };

    return axios.put(`/api/file/${newF._id}`, newF, {
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
  // Get a specified subject
  getSubjects: function (key) {
    const config = {
      'Authorization': key
    };
    return axios.get(`/api/subject/`, {
      headers: config
    }); // SECURE
  },
  // Create a 'Subject' -> Add 'Subject' to 'Grade' subjects
  addSubject: function (newS, key) {
    const config = {
      'Authorization': key
    };

    return axios.post(`/api/subject`, newS, {
      headers: config
    }); // SECURE
  },
  // Update a 'Subject'
  updateSubject: function (newS, key) {
    const config = {
      'Authorization': key
    };

    return axios.put(`/api/subject/${newS._id}`, newS, {
      headers: config
    }); // SECURE
  },
  // Delete a 'Subject' -> Pull 'Subject' from 'Grade' subjects
  deleteSubjects: function (subject_id_list, key) {
    const config = {
      'Authorization': key
    };

    const promises = [];
    for (const subject_id of subject_id_list) {
      promises.push(axios.delete(`/api/subject/${subject_id}`, {
        headers: config
      }))
    }

    return Promise.all(promises)
  },
  // ANNOUNCEMENTS
  // ---------------------------------------------------------------
  // Get all 'Announcement' documents that are not 'private'
  getSchoolAnnouncements: function (key) {
    const config = {
      'Authorization': key
    };
    return axios.get(`/api/general/ann?private=false`, {
      headers: config
    }); // SECURE
  },
  // Get all 'Announcement' documents that are not 'private'
  getAnnouncements: function (key, subject_id) {
    const config = {
      'Authorization': key
    };

    if (subject_id) {
      return axios.get(`/api/subject/${subject_id}/ann`, {
        headers: config
      }); // SECURE
    }

    return axios.get(`/api/general/ann?all=true`, {
      headers: config
    }); // SECURE
  },
  // Deletes an array of 'Announcement'
  deleteAnnouncements: function (ann_id_list, key) {
    const config = {
      'Authorization': key
    };

    const promises = [];
    for (const ann_id of ann_id_list) {
      promises.push(axios.delete(`/api/general/ann/${ann_id}`, {
        headers: config
      }))
    }

    return Promise.all(promises)
  },
  // Update ANY 'Announcement'
  updateAnnouncement: function (newA, key) {
    const config = {
      'Authorization': key
    };

    return axios.put(`/api/general/ann/${newA._id}`, newA, {
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
  // Get a student or teacher associated 'Grade'
  getUserGrade: function (user_id, key) {
    const config = {
      'Authorization': key
    };
    return axios.get(`/api/grade/${user_id}/user`, {
      headers: config
    }); // SECURE
  },
  // Create a 'Grade'
  addGrade: function (newG, key) {
    const config = {
      'Authorization': key
    };

    return axios.post(`/api/grade`, newG, {
      headers: config
    }); // SECURE 
  },
  // Update a 'Grade'
  updateGrade: function (newG, key) {
    const config = {
      'Authorization': key
    };
    return axios.put(`/api/grade/${newG._id}`, newG, {
      headers: config
    }); // SECURE 
  },
  // Delete multiple 'Grade'
  deleteGrades: function (grade_id_list, key) {
    const config = {
      'Authorization': key
    };

    const promises = [];
    for (const grade_id of grade_id_list) {
      promises.push(axios.delete(`/api/grade/${grade_id}`, {
        headers: config
      }))
    }

    return Promise.all(promises)

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
  getAccounts: function (key) {
    const config = {
      'Authorization': key
    };

    return axios.get(`/api/account`, {
      headers: config
    }); // SECURE 
  },
  // Add an 'Account' of ANY type -> Add 'Account' to 'Grade'
  addAccount: function (newU, key) {
    const config = {
      'Authorization': key
    };

    const { first_name, last_name, password, type, grade } = newU;

    const newP = { first_name, last_name, grade };
    const newA = { password, type }

    return axios.post(`/api/account`, { profile: newP, account: newA }, {
      headers: config
    }); // SECURE 
  },
  // Updates 'Account' name 
  updateAccount: function (newU, key) {
    const config = {
      'Authorization': key
    };
    const { _id, profile_id, first_name, last_name, password, grade, type } = newU;

    const newP = { _id: profile_id, first_name, last_name, grade };
    const newA = { _id, password, type }

    return axios.put(`/api/account/${newA._id}`, { profile: newP, account: newA }, {
      headers: config
    }); // SECURE
  },
  // Delete 'Account' and associated profile
  deleteAccounts: function (acc_id_list, key) {
    const config = {
      'Authorization': key
    };

    const promises = [];

    for (const acc_id of acc_id_list) {
      promises.push(axios.delete(`/api/account/${acc_id}`, {
        headers: config
      }))
    }

    return Promise.all(promises)
  },
  // // Updates 'Account' password
  // updateAccountPassword: function (acc_id, oldPassword, newPassword, key) {
  //   const config = JSON.stringify({
  //     'Authorization': {
  //       key,
  //       oldPassword,
  //       newPassword
  //     }
  //   });

  //   return axios.put(`/api/account/${acc_id}?field=password`, {}, {
  //     headers: config
  //   }); // SECURE
  // },

  // Get all accounts (omitting username and password)
  getUsers: function (key) {
    const config = {
      'Authorization': key
    };
    return axios.get(`/api/account`, {
      headers: config
    }); // SECURE
  },

  /// Deals with Assessments
  getAssessments: function (key) {
    const config = {
      'Authorization': key
    };
    return axios.get('/api/assessment', {
      headers: config
    });
  }

};