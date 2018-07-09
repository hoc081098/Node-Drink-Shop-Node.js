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

const Drink = (module.exports = mongoose.model('drinks', schema, 'drinks'));

const projection = { __v: 0 };

/**
 * @param {Number} menu_id,
 * @param {String} phone,
 * @param {String} name,
 * @param {Number} min_price: ,
 * @param {Number} max_price: ,
 * @param {Number} min_star: ,
 * @param {Number} max_star: ,
 * @param sort_name values allowed are 'asc', 'desc', 'ascending', 'descending', '1', and '-1'.
 * @param sort_price values allowed are 'asc', 'desc', 'ascending', 'descending', '1', and '-1'.
 * @param sort_star values allowed are 'asc', 'desc', 'ascending', 'descending', '1', and '-1'.
 * @return array of Drink models
 */
module.exports.getDrink = async (
  menu_id,
  phone,
  name,
  min_price,
  max_price,
  min_star,
  max_star,
  sort_name,
  sort_price,
  sort_star
) => {
  const conditions = {};

  if (menu_id) conditions.menuId = menu_id;

  if (phone) {
    conditions.stars = phone;
  }

  if (name) {
    conditions.name = { $regex: new RegExp(name), $options: 'i' };
  }

  if (max_price || min_price) {
    conditions.$and = conditions.$and || [];
    if (max_price) conditions.$and.push({ price: { $lte: max_price } });
    if (min_price) conditions.$and.push({ price: { $gte: min_price } });
  }

  if (max_star || min_star) {
    conditions.$and = conditions.$and || [];
    if (max_star) conditions.$and.push({ starCount: { $lte: max_star } });
    if (min_star) conditions.$and.push({ starCount: { $gte: min_star } });
  }

  const sort = { sort: {} };
  if (sort_name) sort.sort.name = sort_name;
  if (sort_price) sort.sort.price = sort_price;
  if (sort_star) sort.sort.starCount = sort_star;

  console.log(conditions);
  console.log(sort);
  return Drink.find(conditions, projection, sort).exec();
};

module.exports.getDrinkById = async drinkId => {
  let docs;

  try {
    docs = await Drink.find({ _id: drinkId }, projection)
      .limit(1)
      .exec();
  } catch (e) {
    throw { message: e.message, status: 500 };
  }

  if (docs.length > 0) {
    return docs[0];
  }
  throw { message: 'Drink not found', status: 404 };
};

module.exports.star = (phone, drinkId) => {
  return Drink.findOneAndUpdate(
    {
      _id: drinkId,
      stars: { $ne: phone }
    },
    {
      $inc: { starCount: 1 },
      $push: { stars: phone }
    },
    { new: true }
  ).exec();
};

module.exports.unstar = (phone, drinkId) => {
  return Drink.findOneAndUpdate(
    {
      _id: drinkId,
      stars: phone
    },
    {
      $inc: { starCount: -1 },
      $pull: { stars: phone }
    },
    { new: true }
  ).exec();
};
