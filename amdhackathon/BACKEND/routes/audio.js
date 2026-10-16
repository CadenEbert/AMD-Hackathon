const express = require('express');
const router = express.Router();
const multer = require('multer');
const ingestController = require('../controllers/audioController.js');

// max 50 MB -- Thats the supabase limit for object storage
const upload = multer({ limits: { fileSize: 50 * 1024 * 1024 } });

router.post('/ingest/call/:companyId', upload.single('audio'), ingestController.ingestCall);

module.exports = router;