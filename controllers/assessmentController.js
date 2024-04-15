// TODO: Seed should be stored in the database as opposed to being loaded through the controller. Implement once database logic is finished.

import seed from "../seeds/assessment1.json";


export const getAssessment = (req, res) => {
    res.json([seed]);
};