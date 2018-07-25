const Order = require('../models/order.model');

module.exports.createNewOrder = async (req, res) => {
  console.log(req.body);
  const { price, detail, phone, address } = req.body;
  if (!price || !detail || !phone || !address) {
    return res
      .status(422)
      .json({ message: 'Missing price, detail, phone and address' });
  }

  try {
    const order = await new Order(req.body).save();
    res.status(200).json(order);
  } catch (e) {
    res.status(e.status).json({ message: e.message });
  }
};

module.exports.getOrder = async (req, res) => {
  const { status } = req.query;
  if (
    ['CANCELED', 'PLACED', 'PROCESSING', 'SHIPPING', 'SHIPPED'].indexOf(
      status
    ) == -1
  ) {
    return res.status(422).json({
      message:
        'Status should be either ' +
        ['CANCELED', 'PLACED', 'PROCESSING', 'SHIPPING', 'SHIPPED'].join('or')
    });
  }

  try {
    const docs = await Order.find({ status: status })
      .sort({ createdAt: -1 })
      .exec();
    res.status(200).json(docs);
  } catch (e) {
    res.status(e.status).json({ message: e.message });
  }
};
