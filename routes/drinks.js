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
            sort_star,
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
        res.status(500).json({message: e.message});
    }
});

router.get('/:drink_id', async (req, res) => {
    try {
        const drinks = await Drink.getDrinkById(req.params.drink_id);
        res.status(200).json(drinks);
    } catch (e) {
        res.status(e.status).json({message: e.message});
    }
});

router.post('/star', async (req, res) => {
    const {phone, drink_id} = req.body;
    if (!phone || !drink_id) {
        return res.status(422).json({message: "Required phone and drink id"});
    }

    try {
        const countUser = await User.count({phone: phone});
        if (countUser === 0) {
            return res.status(404).json({message: `User with phone ${phone} not found`});
        }

        const countDrink = await Drink.find({_id: drink_id}).limit(1);
        if (countDrink.length === 0) {
            return res.status(404).json({message: `Drink with id ${drink_id} not found`});
        }

        const r = await Fawn.Task()
            .update(User, {phone: phone}, {$push: {staredDrinkIds: drink_id}})
            .update(Drink, {_id: drink_id}, {$push: {stars: phone}, $inc: {starCount: 1}})
            .run({useMongoose: true});


        const drink = countDrink[0];
        return res.status(200).json({
            ...drink.toObject(),
            stars: [...drink.stars, phone],
            starCount: drink.starCount + 1
        });
    } catch (e) {
        res.status(e.status || 500).json({message: e.message});
    }
});


router.delete('/star', async (req, res) => {
    const {phone, drink_id} = req.body;
    if (!phone || !drink_id) {
        return res.status(422).json({message: "Required phone and drink id"});
    }

    try {
        const countUser = await User.count({phone: phone});
        if (countUser === 0) {
            return res.status(404).json({message: `User with phone ${phone} not found`});
        }

        const countDrink = await Drink.find({_id: drink_id}).limit(1);
        if (countDrink.length === 0) {
            return res.status(404).json({message: `Drink with id ${drink_id} not found`});
        }

        const r = await Fawn.Task()
            .update(User, {phone: phone}, {$pop: {staredDrinkIds: drink_id}})
            .update(Drink, {_id: drink_id}, {$pop: {stars: phone}, $inc: {starCount: -1}})
            .run({useMongoose: true});


        const drink = countDrink[0];
        return res.status(200).json({
            ...drink.toObject(),
            stars: (() => {
                const stars = drink.stars;
                let index = stars.indexOf(phone);
                return [...stars.slice(0, index), ...stars.slice(index + 1)];
            })(),
            starCount: drink.starCount - 1
        });
    } catch (e) {
        res.status(e.status || 500).json({message: e.message});
    }
});

module.exports = router;
