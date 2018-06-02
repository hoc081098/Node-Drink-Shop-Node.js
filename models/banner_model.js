const mongoose = require('mongoose');
const autoIncrement = require('../config/auto-increment');

const schema = new mongoose.Schema({
    name: {
        type: String,
        maxlength: 30
    },
    imageUrl: String
});

schema.plugin(autoIncrement.plugin, 'banners');

const Banner = module.exports = mongoose.model('banners', schema, 'banners');

module.exports.getBanners = (limit) =>
    Banner.find({}, {__v: 0})
        .sort({_id: 1})
        .limit(limit)
        .exec();
