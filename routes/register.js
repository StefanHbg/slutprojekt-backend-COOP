const express = require('express')
const User = require('../modules/User')
const router = express.Router()
const bcrypt = require('bcrypt')
const saltRounds = 10

// Routing för att skapa en användare /api/register.
router.post('/', async (req, res) => {
    // Kollar ifall användaren redan är registrerad. 
    const user = await User.findOne({ "user.email": req.body.email })
    // Är användaren inte registrerad så körs koden nedan
    if (!user) {
        // Här hashas lösenordet så att det blir extra säkert och som inte kan avläsas i browsern alt postman.
        bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
            if (err) res.json(err)
            else {
                // Skapar en ny user.
                const newUser = new User({
                    user: {
                        email: req.body.email,
                        password: hash,
                        name: req.body.name,
                        // Vi kör en ternary som alltid sätter role till customer förutsatt att man inte är admin. Admins reggas i vår DB.
                        role: (req.body.role === 'admin') ? 'admin' : 'customer', 
                        adress: {
                            street: req.body.adress.street,
                            zip: req.body.adress.zip,
                            city: req.body.adress.city
                        },
                        orderHistory: []
                    }
                })
                // Sparar användaren.
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