const router = require("express").Router();
const generalController = require("../../controllers/generalController");

// Matches with "/api/general/ann"
router.route("/ann")
  // Get all public announcements
  .get(generalController.getAnnouncements)
  // Post a public announcement
  .post(generalController.addAnnouncement)

// Matches with "/api/general/ann/:aid"
router.route("/ann/:aid")
  // Deletes a specific public announcement
  .delete(generalController.deleteAnnouncement)
  // Updates a specific announcement
  .put(generalController.updateAnnouncement)

module.exports = router;