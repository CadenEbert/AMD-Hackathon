const express = require('express');
const router = express.Router();
const severityLevelController = require('../controllers/severityLevelController.js');

router.get('/severity-levels/:companyId', severityLevelController.getSeverityLevels);
router.get('/severity-levels/:companyId/:id', severityLevelController.getSeverityLevel);
router.post('/severity-levels/:companyId', severityLevelController.createSeverityLevel);
router.patch('/severity-levels/:companyId/:id', severityLevelController.updateSeverityLevel);
router.delete('/severity-levels/:companyId/:id', severityLevelController.deleteSeverityLevel);

module.exports = router;