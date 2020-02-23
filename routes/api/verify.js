const router = require("express").Router();
const verifyController = require("../../controllers/verifyController");

// Matches with "/api/verify/account"
router.route("/account")
  .get(verifyController.verifyAccount)

// Matches with "/api/verify/session"
router.route("/session")
  .get(verifyController.verifySession)
  .delete(verifyController.destroySession)

// Matches with "/api/verify/database"
router.route("/database")
  .get(verifyController.verifyInitialization)
  .post(verifyController.seedDefault)

// Matches with "/api/verify/load"
router.route("/load")
  .get(verifyController.verifyLatency)

module.exports = router;