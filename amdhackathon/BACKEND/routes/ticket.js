const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController.js');

//example route for creating a ticket
router.post('/add-ticket', ticketController.createTicket);

router.get('/tickets', ticketController.getTickets);

module.exports = router;
