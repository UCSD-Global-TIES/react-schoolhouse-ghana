const router = require("express").Router();
const objController = require("../../controllers/objController");

// Matches with "/api/"
router.route("/")
  .get(objController.find)
  .post(objController.create)
  .delete(objController.delete)
  .put(objController.update)

module.exports = router;