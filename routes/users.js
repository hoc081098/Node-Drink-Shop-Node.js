const express = require('express');
const router = express.Router();
const User = require('../models/user_model');

const multer = require('multer');
const path = require('path');

/* GET all users */
router.get('/', async (req, res) => {
    try {
        const user = await User.getAllUsers();
        res.status(200).json(user);
    } catch (e) {
        res.status(e.status).json({message: e.message});
    }
});

/* GET users by phone field. */
router.get('/:phone', async (req, res) => {
    try {
        const user = await User.getUserByPhone(req.params.phone);
        res.status(200).json(user);
    } catch (e) {
        res.status(e.status).json({message: e.message});
    }
});

/* POST create new users by phone, name, birthday, address. */
router.post('/', async (req, res) => {
    const {phone, name, birthday, address} = req.body;
    if (!phone || !name || !birthday || !address) {
        return res.send(422, "Missing phone, name, birthday and address");
    }

    try {
        const newUser = await User.createUser(phone, name, birthday, address);
        res.status(200).json(newUser);
    } catch (e) {
        res.status(e.status).json({message: e.message});
    }
});

const Storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images');
    },
    filename: (req, file, cb) => {
        const fileName = req.params.phone + path.extname(file.originalname);
        cb(null, fileName);
    }
});
const upload = multer({
    storage: Storage,
    fileFilter: (req, file, cb) => {
        let extname = path.extname(file.originalname);
        if (extname === '.png' || extname === '.jpg') {
            return cb(null, true);
        }
        return cb(new Error('Only accept .png and .jpg image'), false);
    }
}).single('image');
/* POST upload image. */
router.post('/:phone/image', function (req, res) {
    upload(req, res, (err) => {
        if (err)
            return res.status(500).json({message: err.message});

        const filePath = req.file.path;
        const path = filePath.substring(filePath.indexOf("/") + 1);


        User.updateImageUrl(req.params.phone, path)
            .then(user => res.status(200).json(user))
            .catch(e => res.status(500).json({message: e.message}));
    });
});

module.exports = router;
