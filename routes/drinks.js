const express = require('express');
const router = express.Router();

const Drink = require('../models/drink_model');
const User = require('../models/user_model');

const Fawn = require('../config/fawn');

/**
 * GET drinks
 */
router.get('/', async (req, res) => {
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
      sort_star
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
      sort_star
    );
    res.status(200).json(drinks);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/:drink_id', async (req, res) => {
  try {
    const drinks = await Drink.getDrinkById(req.params.drink_id);
    res.status(200).json(drinks);
  } catch (e) {
    res.status(e.status).json({ message: e.message });
  }
});

router.post('/star', async (req, res) => {
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
});

router.post('/unstar', async (req, res) => {
    const { phone, drink_id } = req.body;
    if (!phone || !drink_id) {
        return res.status(422).json({ message: 'Required phone and drink id' });
    }
    try {
        const result = await Drink.unstar(phone, drink_id);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(500).json({message: 'Cannot unstar this drink!'});
        }
    } catch (e) {
        res.status(e.status || 500).json({ message: e.message });
    }
});

module.exports = router;
