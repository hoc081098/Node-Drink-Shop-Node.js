const mongoose = require('mongoose');
const autoIncrement = require('../config/auto-increment');

const schema = new mongoose.Schema({
    name: String,
    imageUrl: String,
});

schema.plugin(autoIncrement.plugin, 'categories');

const Category = module.exports = mongoose.model('categories', schema, 'categories');

module.exports.getCategories = () => Category.find({}, {__v: 0}).exec();