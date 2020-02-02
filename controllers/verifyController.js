const objDb = require("../models/Obj");

module.exports = {
    verifyAccount: function (req, res) {

    },
    verifySession: function (req, res) {

    },
    verifyKey: function (key) {
        // TODO
        return true;
    },
    delete: function (req, res) {
        objDb
            .findOne({})
            .then(dbModel => dbModel.remove())
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    }
}