const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors({ origin: 'http://localhost:4200' }));

app.use('/api', require('./routes/ticket.js'));
app.use('/api', require('./routes/teams.js'));

module.exports = app;
