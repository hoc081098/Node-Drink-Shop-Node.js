const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db_user = 'admin';
const db_password = 'alphaomega';
mongoose.connect(`mongodb://${db_user}:${db_password}@ds159507.mlab.com:59507/database_shop_drink`).catch(console.error);

module.exports = mongoose;