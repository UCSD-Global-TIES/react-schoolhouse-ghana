const questionDb = require("../models/Question");
const responseDb = require("../models/Response");
const formDb = require("../models/Form");
const ip = require("ip")
const API_PORT = process.env.PORT || 3001;

const {
    verifyKey
} = require("./verifyController");
module.exports = {
    getForms: function (req, res) {
        verifyKey(req.header('Authorization'), 'Admin')
            .then((isVerified) => {
                if (isVerified) {
                    formDb
                        .find({})
                        .populate('subjects')
                        .then(gradeDocs => res.json(gradeDocs))
                        .catch(err => res.status(422).json(err));

                } else {
                    res.status(403).json(null);
                }
            })
    }

}