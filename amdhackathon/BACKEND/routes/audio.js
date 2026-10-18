const express = require('express');
const router = express.Router();
const multer = require('multer');
const audioController = require('../controllers/audioController.js');

// max 50 MB -- Thats the supabase limit for object storage
const upload = multer({ limits: { fileSize: 50 * 1024 * 1024 } });

router.post('/audio/call/:companyId', upload.single('audio'), audioController.audioCall);
router.get('/audio/call/status/:id', audioController.callStatus);

module.exports = router;