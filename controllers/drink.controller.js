const Drink = require('../models/drink_model');

module.exports.getDrinks = async (req, res) => {
  //`asc`, `desc`
  try {
    const {
      menu_id,
      phone,
      name,
      min_price,
      max_price,
      min_star,
      max_star,
      sort_name,
      sort_price,
      sort_star,
      limit,
    } = req.query;

    console.log(req.query);
    let drinks = await Drink.getDrink(
      menu_id,
      phone,
      name,
      min_price,
      max_price,
      min_star,
      max_star,
      sort_name,
      sort_price,
      sort_star,
      limit
    );
    res.status(200).json(drinks);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports.getById = async (req, res) => {
  try {
    const drinks = await Drink.getDrinkById(req.params.drink_id);
    res.status(200).json(drinks);
  } catch (e) {
    res.status(e.status).json({ message: e.message });
  }
};

module.exports.star = async (req, res) => {
  const { phone, drink_id } = req.body;
  if (!phone || !drink_id) {
    return res.status(422).json({ message: 'Required phone and drink id' });
  }
  try {
    const result = await Drink.star(phone, drink_id);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(500).json({ message: 'Cannot star this drink!' });
    }
  } catch (e) {
    res.status(e.status || 500).json({ message: e.message });
  }
};

module.exports.unstar = async (req, res) => {
  const { phone, drink_id } = req.body;
  if (!phone || !drink_id) {
    return res.status(422).json({ message: 'Required phone and drink id' });
  }
  try {
    const result = await Drink.unstar(phone, drink_id);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(500).json({ message: 'Cannot unstar this drink!' });
    }
  } catch (e) {
    res.status(e.status || 500).json({ message: e.message });
  }
};

module.exports.getMaxPrice = (req, res) => {
  Drink.find({}, { price: 1, _id: 0 })
    .sort({ price: -1 })
    .limit(1)
    .exec()
    .then(docs => {
      if (docs.length === 0) {
        return res.status(404).json({ message: 'Not found any drink!' });
      }
      res.status(200).json(docs[0]);
    })
    .catch(err => {
      console.log(err);
      res
        .star(500)
        .json({ message: err.message || 'An unknown error occurred!' });
    });
};

module.exports.getMinPrice = (req, res) => {
  Drink.find({}, { price: 1, _id: 0 })
    .sort({ price: 1 })
    .limit(1)
    .exec()
    .then(docs => {
      if (docs.length === 0) {
        return res.status(404).json({ message: 'Not found any drink!' });
      }
      res.status(200).json(docs[0]);
    })
    .catch(err =>
      res
        .star(500)
        .json({ message: err.message || 'An unknown error occurred!' })
    );
};
