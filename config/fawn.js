const Fawn = require('fawn');
const mongoose = require('../config/mongoose');
Fawn.init(mongoose);
module.exports = Fawn;