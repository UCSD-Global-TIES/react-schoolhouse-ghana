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
        if (!date) return;

        if (isShort) return moment(date).format("h:mm a on MM/DD/YY");
        return moment(date).format("dddd, MMMM Do YYYY, h:mm a");
    },
    generatePassword: () => {
        // TODO: Make auth rules that require more conditions for the password (Ex. one lower case, one upper case, one symbol, etc)
        var length = 8,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()",
            retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    }
}