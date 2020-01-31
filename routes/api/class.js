const router = require("express").Router();
const classController = require("../../controllers/classController");

// Matches with "/api/class"
router.route("/")
  // .get(objController.find)
  // .post(objController.create)
  // .delete(objController.delete)
  // .put(objController.update)

  // Matches with "/api/class/:cid"
router.route("/:cid")
// .delete(objController.delete)
// .put(objController.update)

// Matches with "/api/class/:cid/ann/:aid"
router.route("/:cid/ann/:aid")
  // .post(objController.create)
  // .delete(objController.delete)
  // .put(objController.update)

  // Matches with "/api/class/:cid/file/:fid"
router.route("/:cid/file/:fid")
// .delete(objController.delete)
// .put(objController.update)

// Matches with "/api/class/:cid/file"
router.route("/:cid/file")
  // .post(objController.create)
module.exports = router;