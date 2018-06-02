const express = require('express');
const router = express.Router();
const Banner = require('../models/banner_model');

/* GET banners listing. */
router.get('/', async (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 3;
    try {
        const banners = await Banner.getBanners(limit);
        return res.status(200).json(banners);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

module.exports = router;
