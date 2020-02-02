const router = require("express").Router();
const verifyController = require("../../controllers/verifyController");

// Matches with "/api/verify/account"
router.route("/verify/account")
  .get(verifyController.verifyAccount)

// Matches with "/api/verify/session"
router.route("/verify/session")
  .get(verifyController.verifySession)



module.exports = router;