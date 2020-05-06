// TODO: Seed should be stored in the database as opposed to being loaded through the controller. Implement once database logic is finished.
const seed = require("../seeds/assessment1.json");

module.exports = {
    getAssessment: (req, res) => {
        res.json([seed]);
    }
}