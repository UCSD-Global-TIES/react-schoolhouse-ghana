const moment = require('moment');

module.exports = {
    getQueries: (param_str) => {
        let tmp = param_str.split("?")[1];
        tmp = tmp.split("&");

        let res = {};
        for (const item of tmp) {
            const key = item.split("=")[0];
            const field = item.split("=")[1];
            res[key] = field
        }

        return res;
    },
    parseTime: (date, isShort) => {
        if(isShort) return moment(date).format("h:mm a on MM/DD/YY");
        return moment(date).format("dddd, MMMM Do YYYY, h:mm a");
    }
}