const express = require('express');
const app = express();

app.use('/api', require('./routes/ticket.js'));

module.exports = app;