const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController.js');



router.get('/teams/:companyId', teamController.getTeams);

module.exports = router;
