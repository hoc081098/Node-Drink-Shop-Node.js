const mongoose = require('mongoose');
const autoIncrement = require('../config/auto-increment');
const User = require('../models/user_model');

const schema = new mongoose.Schema({
    name: String,
    imageUrl: String,
    price: Number,
    menuId: {
        type: Number,
        index: true
    },
    stars: {
        type: [String], //phones of users has already starred this drink
        default: []
    },
    starCount: {
        type: Number,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value'
        },
        default: 0
    }
});

schema.plugin(autoIncrement.plugin, 'drinks');

const Drink = module.exports = mongoose.model('drinks', schema, 'drinks');

const projection = {__v: 0};

module.exports.getDrink = async (menu_id, phone) => {
    const conditions = {};
    if (menu_id) conditions.menuId = menu_id;

    if (phone) {
        const user = await User.getUserByPhone(phone);
        conditions._id = {$in : user.staredDrinkIds};
    }

    console.log(conditions);
    return Drink.find(conditions, projection)
        .sort({price: 'asc'})
        .exec();
};

module.exports.getDrinkById = async (drinkId) => {
    let docs;

    try {
        docs = await Drink.find({_id: drinkId}, projection).limit(1).exec();
    } catch (e) {
        throw {message: e.message, status: 500};
    }

    if (docs.length > 0) {
        return docs[0];
    }
    throw {message: "Drink not found", status: 404};
};