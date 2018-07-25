const mongoose = require('mongoose');
const autoIncrement = require('../config/auto-increment');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  loc: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: [Number]
  }
});

schema.plugin(autoIncrement.plugin, 'stores');
schema.index({ loc: '2dsphere' });

const Store = (module.exports = mongoose.model('stores', schema, 'stores'));
