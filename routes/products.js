const express = require('express')
const Product = require('../modules/Product')
const router = express.Router()
const jwt = require('jsonwebtoken')

// Routing för att hämta alla produkter /api/products.
router.get('/', async (req, res) => {
    // Hittar alla produkter och skickar det till frontenden.
    const products = await Product.find({});
    res.json(products)
})

// Routing för att skapa en produkt. /api/products.
router.post('/', async (req, res) => {
    // Här kollar vi om en user är inloggad.  
    if (!req.cookies['auth-token']) {
        res.send("Only for logged-in users")
    } else {
        const token = await req.cookies['auth-token']

        // Här verifierar vi att token stämmer överens tillsammans med vår dotenv.
        jwt.verify(token, process.env.SECRET,async (err, payload) => {
            if (err) {
                res.json(err)
            } else if (payload.role === 'admin') {
                // Skapar en produkt förutsatt att man är inloggad som admin.
                const singleProduct = await Product.create({
                    title: req.body.title,
                    price: req.body.price,
                    shortDesc: req.body.shortDesc,
                    longDesc: req.body.longDesc,
                    imgFile: req.body.imgFile
                })
                // Om produkten skapats skickas den till frontenden.
                if (singleProduct) {
                    res.json({product: singleProduct})
                } else {
                    res.send('Could not create a product.')
                }
                // Kan inte skapa en produkt om du inte är inloggad som admin.
            } else res.send('You are not an admin')
        })
    }
})

// Routing för att uppdatera en produkt Tex: /api/products/60ae22f7756ae54411137a1c
router.patch('/:id', async (req, res) => {
    // Här kollar vi om en user är inloggad.  
    if (!req.cookies['auth-token']) {
        res.send("Only for logged-in users")
    } else {
        const token = await req.cookies['auth-token']
        
        // Här verifierar vi att token stämmer överens tillsammans med vår dotenv.
        jwt.verify(token, process.env.SECRET,async (err, payload) => {
            if (err) {
                res.json(err)
            } else if (payload.role === 'admin') {
                // Förutsatt att man är inloggad som admin kan vi uppdatera informationen om en produkt. 
                const singleProduct = await Product.findOneAndUpdate(
                    {
                        _id: req.body._id
                    },
                    { 
                        title: req.body.title,
                        price: req.body.price,
                        shortDesc: req.body.shortDesc,
                        longDesc: req.body.longDesc,
                        imgFile: req.body.imgFile
                    }
                );
                // Om produkten ändrats skickas den till frontenden.
                if (singleProduct) {
                    res.send(singleProduct)
                } else {
                    res.send('Sorry. Your edit could not be saved.')
                }
            // Kan inte uppdatera information om en produkt om du inte är inloggad som admin.
            } else res.send('You are not an admin')
        })
    }
})

// Routing för att ta bort en produkt. Tex: /api/products/60ae22f7756ae54411137a1c
router.delete('/:id', async (req, res) => {
    // Här kollar vi om en user är inloggad.  
    if (!req.cookies['auth-token']) {
        res.send("Only for logged-in users")
    } else {
        const token = await req.cookies['auth-token']
        
        // Här verifierar vi att token stämmer överens tillsammans med vår dotenv.
        jwt.verify(token, process.env.SECRET,async (err, payload) => {
            if (err) {
                res.json(err)
            } else if (payload.role === 'admin') {
                // Förutsatt att man är inloggad som admin kan vi hitta en produkt och ta bort den.
                const deletedProduct = await Product.findByIdAndRemove({_id: req.params.id})

                // Om produkten tagits bort så tas den bort från frontenden.
                if (deletedProduct) {
                    res.send(deletedProduct)
                
                // Kan inte ta bort en produkt eller så hittas den inte.
                } else {
                    res.status(401).send('You cannot delete a product')
                }
            // Här kör vi en else som skriver ut att man inte är Admin när vi försöker ta bort en produkt i postman/insomnia.
            } else res.send('You are not an admin')
        })
    }
})

module.exports = router