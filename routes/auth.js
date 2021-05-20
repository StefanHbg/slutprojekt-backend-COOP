const express = require('express')
const router = express.Router()
const User = require('../modules/User');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const saltRounds = 10

router.post('/', async (req, res) => {
    // Hämta data för den användare som har det namn som skrivits in
    const user = await User.findOne({ "user.email": req.body.email })
    //console.log(req.body.email);
    console.log(user);
    if (user) {
        console.log(req.body.email);
        console.log(req.body.password);
        // Kolla om lösenordet stämmer. 
        //console.log(user.user.password);
        bcrypt.compare(req.body.password, user.user.password, function(err, result) {
            if (err) res.json(err)

            if (result) {
                //console.log(result)
                const payload = {
                    iss: 'coop',
                    exp: Math.floor(Date.now() / 1000) + (60 * 0.5),
                    role: user.user.role
                }
                // I så fall, signa och skicka token.
                const token = jwt.sign(payload, process.env.SECRET)
                res.cookie('auth-token', token)
                res.json({
                    token: token,
                    user: user.user
                })
            } else {
                res.json({ message: 'Your credentials is wrong' })
            }
        })
    }
})


module.exports = router