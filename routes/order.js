const express = require('express');
const router = express.Router();
const controller = require('../controllers/order.controller');

router.post('/', controller.createNewOrder);

router.get('/', controller.getOrder);

router.put('/', controller.cancelOrder);

module.exports = router;
