const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    phone: {
        type: String,
        index: true,
        unique: true,
        trim: true,
        maxlength: 20,
        required: true
    },
    name: {
        type: String,
        trim: true,
        maxlength: 50,
        required: true
    },
    birthday: {
        type: Date,
        min: new Date(1970, 1, 1, 0, 0, 0, 0),
        default: Date.now(),
        required: true
    },
    address: {
        type: String,
        maxlength: 100,
        required: true
    },
    imageUrl: {
        type: String,
        default: null
    },
    staredDrinkIds: {
        type: [Number],
        default: [],
    }
});

const User = module.exports = mongoose.model('users', schema, 'users');

const projection = {__v: 0, _id: 0};

/* Return user */
module.exports.getUserByPhone = async (phone) => {
    let docs;
    try {
        docs = await User.find({phone: phone}, projection)
            .limit(1)
            .exec();
    } catch (e) {
        throw {message: e.message, status: 500};
    }

    if (docs.length > 0) {
        return docs[0];
    }
    throw {message: "User not found", status: 404};
};

const isValidDate = (dateString) => {
    // First check for the pattern
    if (!/\d{4}-\d{1,2}-\d{1,2}/g.test(dateString)) {
        return false;
    }

    // Parse the date parts to integers
    const parts = dateString.split('-');
    const day = parseInt(parts[2], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[0], 10);

    // Check the ranges of month and year
    if (year < 1000 || year > 3000 || month === 0 || month > 12) {
        return false;
    }

    const isLeapYear = year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
    const monthLength = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
};

/* Create new user, return new user created */
module.exports.createUser = async (phone, name, birthday, address) => {
    if (!isValidDate(birthday)) {
        throw {message: 'Invalid birthday format', status: 400}
    }

    try {
        const newUser = new User({
            phone: phone,
            name: name,
            birthday: new Date(birthday),
            address: address
        });

        return await newUser.save();
    } catch (e) {
        throw {message: e.message, status: 500};
    }
};

module.exports.getAllUsers = () => User.find({}, projection).exec();

/* Create new user, return user modified */
module.exports.updateImageUrl = (phone, path) => User.findOneAndUpdate(
    {phone: phone},
    {$set: {imageUrl: path}},
    {new: 1, projection: projection}
);