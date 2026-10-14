const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController.js');



router.get('/tickets/:companyId', ticketController.getTickets);
router.get('/tickets/:companyId/:id', ticketController.getTicket);
router.patch('/tickets/:companyId/:id', ticketController.updateTicket);

module.exports = router;
