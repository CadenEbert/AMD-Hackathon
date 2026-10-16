const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

app.use('/api', require('./routes/ticket.js'));
app.use('/api', require('./routes/teams.js'));
app.use('/api', require('./routes/severityLevels.js'));
app.use('/api', require('./routes/audio.js'));

module.exports = app;
