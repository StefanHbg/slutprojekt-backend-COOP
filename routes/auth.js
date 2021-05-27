const express = require('express')
const router = express.Router()
const User = require('../modules/User');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const saltRounds = 10

// Routing för inlogget. /api/auth.
router.post('/', async (req, res) => {
    // Hämta data för den användare som loggat in.
    const user = await User.findOne({ "user.email": req.body.email })

    // En if sats som kollar om den hittat en användare.
    if (user) {
        // Kontrollera och jämföra om lösenordet stämmer överens. 
        bcrypt.compare(req.body.password, user.user.password, function(err, result) {
            if (err) res.json(err)

            // Om lösenorden stämmer överens skapar vi en user payload.
            if (result) {
                const payload = {
                    _id: user.id,
                    iss: 'coop',
                    exp: Math.floor(Date.now() / 1000) + (60 * 60),
                    name: user.user.name,
                    email: user.user.email,
                    role: user.user.role,
                    adress: user.user.adress
                }
                // Signa och skicka token samt user.
                const token = jwt.sign(payload, process.env.SECRET)
                res.cookie('auth-token', token)
                res.json({
                    token: token,
                    user: payload
                })
            } else {
                res.json({ message: 'Your credentials is wrong' })
            }
        })
    }
})

module.exports = router