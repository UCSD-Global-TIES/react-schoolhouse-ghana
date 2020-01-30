const objDb = require("../models/Obj");

module.exports = {
    create: function(req, res) {
        objDb
            .create(req.body)
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },
    find: function(req, res) {
        objDb
            .findOne({})
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },
    update: function(req, res) {
        
        objDb
        .findOneAndUpdate({ }, req.body)
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err));
    }, 
    delete: function(req, res) {
        objDb
            .findOne({ })
            .then(dbModel => dbModel.remove())
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    }
}