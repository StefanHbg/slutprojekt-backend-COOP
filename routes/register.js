const express = require('express')
const User = require('../modules/User')
const router = express.Router()
const bcrypt = require('bcrypt')
const saltRounds = 10

router.post('/', async (req, res) => {
    const user = await User.findOne({ "user.email": req.body.email })
    if (!user) {
        bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
            if (err) res.json(err)
            else {
                const newUser = new User({
                    user: {
                        email: req.body.email,
                        password: hash, //hashed password
                        name: req.body.name,
                        role: (req.body.role === 'admin') ? 'admin' : 'customer', //vi kör en ternary som kollar om name = admin. Är den admin ge role admin annars ge customer.
                        adress: {
                            street: req.body.adress.street,
                            zip: req.body.adress.zip,
                            city: req.body.adress.city
                        },
                        orderHistory: []
                    }
                })
                newUser.save((err) => {
                    if (err) res.json(err)
                    else {
                        res.json(newUser);
                    }
                })
            }
        })
    } else res.json({ msg: "Email is already taken" });
})

module.exports = router