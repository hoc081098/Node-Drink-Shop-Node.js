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
    required: true,
    indexes: true
  },
  address: {
    type: String,
    maxlength: 100,
    required: true
  },
  status: {
    default: 'PLACED',
    type: String,
    enum: ['CANCELED', 'PLACED', 'PROCESSING', 'SHIPPING', 'SHIPPED'],
    index: true
  },
  createdAt: {
    type: Date,
    min: new Date(1970, 1, 1, 0, 0, 0, 0),
    default: Date.now,
    required: true
  },
  updatedAt: {
    type: Date,
    min: new Date(1970, 1, 1, 0, 0, 0, 0),
    default: Date.now
  }
});

schema.plugin(autoIncrement.plugin, 'orders');

const Order = (module.exports = mongoose.model('orders', schema, 'orders'));
