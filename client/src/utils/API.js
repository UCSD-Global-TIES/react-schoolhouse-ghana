import axios from "axios";

export default {
  getObj: function () {
    return axios.get(`/api/obj`);
  }
};