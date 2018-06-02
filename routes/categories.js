const express = require('express');
const router = express.Router();
const Category = require('../models/category_model');

/* GET categories listing. */
router.get('/', async (req, res) => {
    try {
        const banners = await Category.getCategories();
        return res.status(200).json(banners);
    } catch (e) {
        res.status(500).json({message: e.message});
    }
});

module.exports = router;
