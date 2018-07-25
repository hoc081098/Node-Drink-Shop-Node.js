const express = require('express');
const router = express.Router();
const controller = require('../controllers/store.controller');

router.get('/', controller.getNearbyStore);

module.exports = router;
