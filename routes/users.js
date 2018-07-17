const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');

/* GET all users */
router.get('/', controller.getAll);

/* GET users by phone field. */
router.get('/:phone', controller.getByPhone);

/* POST create new users by phone, name, birthday, address. */
router.post('/', controller.createNew);

/* POST upload image. */
router.post('/:phone/image', ...controller.uploadImage);

module.exports = router;
