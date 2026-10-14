const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController.js');



router.get('/tickets/:companyId', ticketController.getTickets);

module.exports = router;
