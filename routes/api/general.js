const router = require("express").Router();
const generalController = require("../../controllers/generalController");

router.route("/ann")
  .post(generalController.addAnnouncement)

// Matches with "/api/class/:cid/ann/:aid"
router.route("/ann/:aid")
  .delete(generalController.deleteAnnouncement)
  .put(generalController.updateAnnouncement)

module.exports = router;