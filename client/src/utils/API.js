import axios from "axios";
import encrypt from "./encrypt";

// ROUTES UNSECURED
export default {
  // CLASS ANNOUNCEMENTS
  // ---------------------------------------------------------------
  // *GET in getClass()*
  addClassAnnouncement: function (class_id, newA, key) {
    const config = {'Authorization': key};
    return axios.post(`/api/class/${class_id}/ann`, newA, {headers: config}); // SECURE
  },
  deleteClassAnnouncement: function (class_id, ann_id, key) {
    const config = {'Authorization': key};
    return axios.delete(`/api/class/${class_id}/ann/${ann_id}`, {headers: config} ); // SECURE
  },
  updateClassAnnouncement: function (class_id, ann_id, newA, key) {
    const config = {'Authorization': key};
    return axios.put(`/api/class/${class_id}/ann/${ann_id}`, newA, {headers: config}); // SECURE
  },
  // FILES
  // ---------------------------------------------------------------
  // *GET in getClass()*
  // https://programmingwithmosh.com/javascript/react-file-upload-proper-server-side-nodejs-easy/
  addClassFile: function (class_id, file, filename, path, key) {
    const config = {'Authorization': key};
    const fileData = new FormData();
    fileData.append('file', file);
    fileInfo.append('name', filename);
    fileInfo.append('path', path);

    return axios.post(`/api/class/${class_id}/file`, fileData, {headers: config}); // SECURE
  },
  deleteClassFile: function (class_id, file_id, key) {
    const config = {'Authorization': key};
    return axios.delete(`/api/class/${class_id}/file/${file_id}`, {headers: config}); // SECURE
  },
  updateClassFile: function (class_id, file_id, newF, key) {
    const config = {'Authorization': key};
    return axios.put(`/api/class/${class_id}/file/${file_id}`, newF, {headers: config}); // SECURE
  },
  // CLASSES
  // ---------------------------------------------------------------
  // May be slow with four populate calls
  getClass: function (class_id, key) {
    const config = {'Authorization': key};
    return axios.get(`api/class/${class_id}`, {headers: config}); // SECURE
  },
  addClass: function (newC, path, key) {
    const config = {'Authorization': key};
    return axios.post(`/api/class`, {document: newC, path}, {headers: config}); // SECURE
  },
  updateClass: function (class_id, newC, key) {
    const config = {'Authorization': key};
    return axios.put(`/api/class/${class_id}`, newC, {headers: config}); // SECURE
  },
  deleteClass: function (class_id, key) {
    const config = {'Authorization': key};
    return axios.delete(`/api/class/${class_id}`, {headers: config}); // SECURE
  },
  // CLASSES MEMBERS
  // ---------------------------------------------------------------
  addStudent: function (sid, path, key) {
    const config = {'Authorization': key};
    return axios.post(`/api/class/${class_id}/student`, {sid}, {headers: config}); // SECURE
  },
  deleteStudent: function (key) {
    const config = {'Authorization': key};
    return axios.delete(`/api/class/${class_id}/student`, {headers: config}); // SECURE
  },

  // ANNOUNCEMENTS
  // ---------------------------------------------------------------
  // *GET in getClass()*
    // CLASS ANNOUNCEMENTS
  // ---------------------------------------------------------------
  // *GET in getClass()*
  addSchoolAnnouncement: function (newA, key) {
    const config = {'Authorization': key};
    return axios.post(`/api/general/ann`, newA, {headers: config}); // SECURE
  },
  deleteSchoolAnnouncement: function (ann_id, key) {
    const config = {'Authorization': key};
    return axios.delete(`/api/general/ann/${ann_id}`, {headers: config}); // SECURE
  },
  updateSchoolAnnouncement: function (ann_id, newA, key) {
    const config = {'Authorization': key};
    return axios.put(`/api/general/ann/${ann_id}`, newA, {headers: config}); // SECURE
  },
  // GRADES
  // ---------------------------------------------------------------
  // Populate classes
  getGrade: function (grade_id, key) {
    const config = {'Authorization': key};
    return axios.get(`api/grade/${grade_id}`, {headers: config}); // SECURE
  },
  addGrade: function (newG, key) {
    const config = {'Authorization': key};
    return axios.post(`/api/grade`, newG, {headers: config}); // SECURE 
  },
  updateGrade: function (grade_id, newG, key) {
    const config = {'Authorization': key};
    return axios.put(`/api/grade/${grade_id}`, newG, {headers: config}); // SECURE
  },
  deleteGrade: function (grade_id, key) {
    const config = {'Authorization': key};
    return axios.delete(`/api/grade/${grade_id}`, {headers: config}); // SECURE
  },
  // ACCOUNTS
  // ---------------------------------------------------------------
  // Populate profile
  verifyAccount: function (username, password) {
    const hash = encrypt(password);
    return axios.get(`api/verify/?username=${username}?password=${hash}`); 
  },
  // Add option for creating multiple accounts
  createAccount: function (newA, key) {
    const config = {'Authorization': key};
    return axios.post(`/api/account`, newA, {headers: config}); // SECURE 
  },
  updateAccount: function (acc_id, newA, key) {
    const config = {'Authorization': key};
    return axios.put(`/api/account/${acc_id}`, newA, {headers: config}); // SECURE
  },
  deleteAccount: function (acc_id, key) {
    const config = {'Authorization': key};
    return axios.delete(`/api/account/${acc_id}`, {headers: config}); // SECURE
  }
};

// ADD TEACHERS
// ADD STUDENTS