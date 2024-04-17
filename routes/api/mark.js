const router = require("express").Router();
const markController = require("../../controllers/markController"); 

router.post('/', markController.createMark); 
router.get('/', markController.getMarks); 
router.get('/username/:username', markController.getMarksByUsername);  
router.get('/:id', markController.getMark); 
router.put('/:id', markController.updateMark); 
router.delete('/:id', markController.deleteMark); 

module.exports = router;
