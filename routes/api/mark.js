const router = require("express").Router();
const apiRoutes = require("./api");
const Mark = require("../../controllers/markController"); 


router.use("/api", apiRoutes);
router.post('/marks', markController.createMark);

router.post('/marks', async (req, res) => {
    try {
      const { studentName, assignmentName, mark } = req.body;
  
    
      const newMark = new Mark({
        studentName,
        assignmentName,
        grade: mark,
      });
  
      await newMark.save();
  
      res.status(201).json({ success: true, message: 'Mark saved successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error saving mark.' });
    }
});

module.exports = router;
