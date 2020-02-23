const router = require("express").Router();
const accountController = require("../../controllers/accountController");

// Matches with "/api/account"
router.route("/")
  // Creates a new user account
  .post(accountController.addAccount)
  .get(accountController.getAccounts)

// Matches with "/api/account/:aid"
router.route("/:aid")
  // Deletes a specific account
  .delete(accountController.deleteAccount)
  // Updates a specific account
  .put(accountController.updateAccount)

module.exports = router;