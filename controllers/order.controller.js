const Order = require('../models/order');

module.exports.createNewOrder = async (req, res) => {
    console.log(req.body);
    const { price, detail, comment, phone, address } = req.body;
    if (!price || !detail || !comment || !phone || !address) {
        return res
            .status(422)
            .json({ message: 'Missing price, detail, comment, phone and address' });
    }

    try {
        const order = await (new Order(req.body)).save();
        res.status(200).json(order);
    } catch (e) {
        res.status(e.status).json({ message: e.message });
    }
};