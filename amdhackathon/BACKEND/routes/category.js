const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController.js');


router.post('/categories', categoryController.createCategory);

module.exports = router;
