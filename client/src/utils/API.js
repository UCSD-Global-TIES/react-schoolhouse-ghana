import axios from "axios";
import encrypt from "./encrypt";

// ROUTES UNSECURED
// CONVERT ALL API FUNCTIONS SO YOU PASS IN VARIABLES NOT A OBJECT
export default {
  // CLASS ANNOUNCEMENTS
  // ---------------------------------------------------------------
  // *GET in getClass()*
  addClassAnnouncement: function (class_id, title, content, authorID, authorType, key) {
    const config = {
      'Authorization': key
    };
    const newA = {
      title,
      author: authorID,
      authorType,
      content
    };
    return axios.post(`/api/class/${class_id}/ann`, newA, {
      headers: config
    }); // SECURE
  },
  deleteClassAnnouncement: function (class_id, ann_id, key) {
    const config = {
      'Authorization': key
    };
    return axios.delete(`/api/class/${class_id}/ann/${ann_id}`, {
      headers: config
    }); // SECURE
  },
  updateClassAnnouncement: function (class_id, ann_id, title, content, key) {
    const config = {
      'Authorization': key
    };
    const newA = {
      title,
      content,
      last_updated: Date.now()
    }
    return axios.put(`/api/class/${class_id}/ann/${ann_id}`, newA, {
      headers: config
    }); // SECURE
  },
  // FILES
  // ---------------------------------------------------------------
  // *GET in getClass()*
  // https://programmingwithmosh.com/javascript/react-file-upload-proper-server-side-nodejs-easy/
  addClassFile: function (class_id, file, nickname, path, key) {
    const config = {
      'Authorization': key
    };
    const fileData = new FormData();
    fileData.append('file', file);
    fileData.append('name', nickname);
    fileData.append('path', path);

    return axios.post(`/api/class/${class_id}/file`, fileData, {
      headers: config
    }); // SECURE
  },
  deleteClassFile: function (class_id, file_id, key) {
    const config = {
      'Authorization': key
    };
    return axios.delete(`/api/class/${class_id}/file/${file_id}`, {
      headers: config
    }); // SECURE
  },
  updateClassFile: function (class_id, file_id, nickname, key) {
    const config = {
      'Authorization': key
    };
    const newF = {
      nickname,
      last_updated: Date.now()
    }
    return axios.put(`/api/class/${class_id}/file/${file_id}`, newF, {
      headers: config
    }); // SECURE
  },
  // CLASSES
  // ---------------------------------------------------------------
  // May be slow with four populate calls
  getClass: function (class_id, key) {
    const config = {
      'Authorization': key
    };
    return axios.get(`/api/class/${class_id}`, {
      headers: config
    }); // SECURE
  },
  addClass: function (name, gradeID, gradePath, key) {
    const config = {
      'Authorization': key
    };
    const newC = {
      name,
      grade: gradeID
    };

    return axios.post(`/api/class`, {
      document: newC,
      path: gradePath
    }, {
      headers: config
    }); // SECURE
  },
  updateClass: function (class_id, name, key) {
    const config = {
      'Authorization': key
    };

    const newC = {
      name
    };
    return axios.put(`/api/class/${class_id}`, newC, {
      headers: config
    }); // SECURE
  },
  deleteClass: function (class_id, key) {
    const config = {
      'Authorization': key
    };
    return axios.delete(`/api/class/${class_id}`, {
      headers: config
    }); // SECURE
  },
  // CLASS MEMBERS
  // ---------------------------------------------------------------
  addStudent: function (class_id, sid, key) {
    const config = {
      'Authorization': key
    };
    return axios.post(`/api/class/${class_id}/student`, {
      sid
    }, {
      headers: config
    }); // SECURE
  },
  deleteStudent: function (class_id, sid, key) {
    const config = {
      'Authorization': key
    };
    return axios.delete(`/api/class/${class_id}/student`, {
      headers: config,
      data: {
        sid
      }
    }); // SECURE
  },
  addTeacher: function (class_id, tid, key) {
    const config = {
      'Authorization': key
    };
    return axios.post(`/api/class/${class_id}/teacher`, {
      tid
    }, {
      headers: config
    }); // SECURE
  },
  deleteTeacher: function (class_id, tid, key) {
    const config = {
      'Authorization': key
    };
    return axios.delete(`/api/class/${class_id}/teacher`, {
      headers: config,
      data: {
        tid
      }
    }); // SECURE
  },
  // ANNOUNCEMENTS
  // ---------------------------------------------------------------
  getSchoolAnnouncements: function (key) {
    const config = {
      'Authorization': key
    };
    return axios.get(`/api/general/ann`, {
      headers: config
    }); // SECURE
  },
  addSchoolAnnouncement: function (title, content, authorID, authorType, key) {
    const config = {
      'Authorization': key
    };
    let doc = {
      title,
      content,
      author: authorID,
      authorType,
      private: false
    };
    return axios.post(`/api/general/ann`, doc, {
      headers: config
    }); // SECURE
  },
  deleteSchoolAnnouncement: function (ann_id, key) {
    const config = {
      'Authorization': key
    };
    return axios.delete(`/api/general/ann/${ann_id}`, {
      headers: config
    }); // SECURE
  },
  updateSchoolAnnouncement: function (ann_id, title, content, key) {
    const config = {
      'Authorization': key
    };
    const newA = {
      title,
      content,
      last_updated: Date.now()
    }
    return axios.put(`/api/general/ann/${ann_id}`, newA, {
      headers: config
    }); // SECURE
  },
  // GRADES
  // ---------------------------------------------------------------
  // Populate classes
  getGrades: function (key) {
    const config = {
      'Authorization': key
    };
    return axios.get(`/api/grade`, {
      headers: config
    }); // SECURE
  },
  getGrade: function (grade_id, key) {
    const config = {
      'Authorization': key
    };
    return axios.get(`/api/grade/${grade_id}`, {
      headers: config
    }); // SECURE
  },
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
  // updateGrade: function (grade_id, level, key) {
  //   const config = {
  //     'Authorization': key
  //   };
  //   const newG = {
  //     level
  //   };
  //   return axios.put(`/api/grade/${grade_id}`, newG, {
  //     headers: config
  //   }); // SECURE
  // },
  deleteGrade: function (grade_id, key) {
    const config = {
      'Authorization': key
    };
    return axios.delete(`/api/grade/${grade_id}`, {
      headers: config
    }); // SECURE
  },
  // ACCOUNTS
  // ---------------------------------------------------------------
  verifyAccount: function (username, password) {
    const config = {
      'Authorization': {
        username,
        password
      }
    };
    return axios.get(`/api/verify/account`, {
      headers: config
    });
  },
  verifySession: function () {
    return axios.get(`/api/verify/session`);
  },
  // Add option for creating multiple accounts
  addAccount: function (first_name, last_name, type, gradeID, key) {
    const config = {
      'Authorization': key
    };
    let newA = {
      first_name,
      last_name,
      type
    };
    if (gradeID) newA.grade = gradeID;

    return axios.post(`/api/account`, newA, {
      headers: config
    }); // SECURE 
  },
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
  updateAccountPassword: function (acc_id, oldPassword, newPassword, key) {
    const config = {
      'Authorization': {
        key,
        oldPassword,
        newPassword
      }
    };

    return axios.put(`/api/account/${acc_id}?field=password`, {}, {
      headers: config
    }); // SECURE
  },
  deleteAccount: function (acc_id, key) {
    const config = {
      'Authorization': key
    };
    return axios.delete(`/api/account/${acc_id}`, {
      headers: config
    }); // SECURE
  }
};