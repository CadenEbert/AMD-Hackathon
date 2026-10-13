const express = require('express');
const router = express.Router();
const authController = require('../controllers/ticketController.js');

//example route for creating a ticket
router.post('/ticket', authController.createTicket);

module.exports = router;
