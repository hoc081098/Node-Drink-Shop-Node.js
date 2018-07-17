const express = require('express');
const router = express.Router();
const controller = require('../controllers/drink.controller');

/* GET drinks */
router.get('/', controller.getDrinks);

router.get('/:drink_id', controller.getById);

router.post('/star', controller.star);

router.post('/unstar', controller.unstar);

router.get('/price/max', controller.getMaxPrice);

router.get('/price/min', controller.getMinPrice);

module.exports = router;
