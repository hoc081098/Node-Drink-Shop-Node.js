const mongoose = require('mongoose');
const autoIncrement = require('../config/auto-increment');

const schema = new mongoose.Schema({
  price: {
    required: true,
    type: Number
  },
  detail: {
    required: true,
    type: [
      {
        name: String,
        drinkId: Number,
        imageUrl: String,
        number: Number,
        comment: String,
        cupSize: String,
        sugar: Number,
        ice: Number,
        price: Number
      }
    ]
  },
  comment: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true,
    maxlength: 20,
    required: true
  },
  address: {
    type: String,
    maxlength: 100,
    required: true
  },
  status: {
    default: 'NEW',
    type: String,
    enum: ['CANCELED', 'NEW', 'PROCESSING', 'SHIPPING', 'SHIPPED']
  }
});

schema.plugin(autoIncrement.plugin, 'orders');

const Order = (module.exports = mongoose.model('orders', schema, 'orders'));
