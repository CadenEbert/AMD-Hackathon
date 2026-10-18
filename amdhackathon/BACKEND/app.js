const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

app.use('/api', require('./routes/ticket.js'));
app.use('/api', require('./routes/teams.js'));
app.use('/api', require('./routes/severityLevels.js'));
app.use('/api', require('./routes/audio.js'));
app.use('/api', require('./routes/category.js'));
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File too large (15 MB max)' });
  }
  next(err);
});

module.exports = app;
