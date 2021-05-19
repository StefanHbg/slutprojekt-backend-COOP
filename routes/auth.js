const express = require('express')
const router = express.Router()
const User = require('../modules/User');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const saltRounds = 10

router.post('/', async (req, res) => {
    // Hämta data för den användare som har det namn som skrivits in
    const user = await User.findOne({ user: req.body.email })
    //console.log(req.body.password);

    if (user) {
        console.log(req.body.email);
        // Kolla om lösenordet stämmer. 
        bcrypt.compare(req.body.password, user.password, function(err, result) {
            if (err) res.json(err)

            if (result !== false) {
                //console.log(result)
                const payload = {
                    iss: 'coop',
                    exp: Math.floor(Date.now() / 1000) + (60 * 5),
                    role: user.role
                }
                // I så fall, signa och skicka token.
                const token = jwt.sign(payload, process.env.SECRET)
                res.cookie('auth-token', token)
                res.send("Välkommen " + user.name)

            } else {
                res.send("Dina credentials stämde inte")
            }
        })
    }
})


module.exports = router