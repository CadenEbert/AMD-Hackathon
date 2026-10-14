const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController.js');



router.get('/teams/:companyId', teamController.getTeams);
router.get('/teams/:companyId/:id', teamController.getTeam);
router.post('/teams/:companyId', teamController.createTeam);
router.patch('/teams/:companyId/:id', teamController.updateTeam);

module.exports = router;
