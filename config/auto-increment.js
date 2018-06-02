const mongoose = require('../config/mongoose');

const db_user = 'admin';
const db_password = 'alphaomega';
const connection = mongoose.createConnection(`mongodb://${db_user}:${db_password}@ds159507.mlab.com:59507/database_shop_drink`);

const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(connection);

module.exports = autoIncrement;