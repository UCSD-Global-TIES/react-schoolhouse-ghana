const router = require("express").Router();
const classController = require("../../controllers/classController");

// Matches with "/api/class"
router.route("/")
  .post(classController.addClass)

// Matches with "/api/class/:cid"
router.route("/:cid")
  .get(classController.getClass)
  .delete(classController.deleteClass)
  .put(classController.updateClass)

router.route("/:cid/ann")
  .post(classController.addAnnouncement)

// Matches with "/api/class/:cid/ann/:aid"
router.route("/:cid/ann/:aid")
  .delete(classController.deleteAnnouncement)
  .put(classController.updateAnnouncement)

// Matches with "/api/class/:cid/file"
router.route("/:cid/file")
  .post(classController.addFile)

// Matches with "/api/class/:cid/file/:fid"
router.route("/:cid/file/:fid")
  .delete(classController.deleteFile)
  .put(classController.updateFile)


module.exports = router;