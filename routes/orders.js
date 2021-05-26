const express = require('express')
const Order = require('../modules/Order')
const Product = require('../modules/Product')
const User = require('../modules/User')
const router = express.Router()
const jwt = require('jsonwebtoken')

// Routing för att skapa en order. /api/orders
router.post('/', async (req, res) => {
    // items är en array där produkt id lagras från de produkter användaren beställer.
    let items = req.body.items;

    // Här kollar vi om en user är inloggad.  
    if (!req.cookies['auth-token']) {
        res.send("Only for logged-in users")
    } else {
        const token = await req.cookies['auth-token']
        // Här verifierar vi att token stämmer överens tillsammans med vår dotenv.
        jwt.verify(token, process.env.SECRET, async(err, payload) => {
            if (err) {
                res.status(401).json(err)
            } else {
                if (payload.role === 'customer') {     
/* 
                    const multipleProd = [];
                    items.forEach(id => {

                    }); Problem att lägga till flera av samma produkt. Summerar inte. Fråga Hans */
                    const products = await Product.find({ _id: { $in: items } });
                    console.log('iteeems', items);
                    console.log('produuuuuukter', products);
                    // Skapar en ny order och räkna ihop summan av produkterna. 
                    const newOrder = await new Order({
                        timeStamp: Date.now(),
                        status: 'inProcess',
                        items: items,
                        orderValue: products.reduce((total, prod) => total + prod.price, 0)
                    })
                    // Sparar en ny order. 
                    await newOrder.save((err) => {
                        if (err) {
                            res.json(err)
                        }
                    })
                    // Här letar vi efter en användare och uppdaterar dess orderHistory. 
                    const user = await User.findOneAndUpdate(
                        { "user.email": payload.email },
                        { $push: {"user.orderHistory": newOrder._id}},
                        {useFindAndModify: false}
                    );
                    // Hittas user så skickas ordern med. (frontend)
                    if (user) res.json(newOrder);
                    
                    // Som admin kan vi inte beställa.
                }  else if (payload.role === 'admin') {
                    res.status(401).json(err);
                }  else {
                res.json(err)
            }} 
        })
    }
})  

// Routing för att hämta en order. /api/orders
router.get('/', async (req, res) => {
    // Här kollar vi om en user är inloggad.  
    if (!req.cookies['auth-token']) {
        res.send("Only for logged-in users")
    } else {
        const token = await req.cookies['auth-token']
        // Här verifierar vi att token stämmer överens tillsammans med vår dotenv.
        jwt.verify(token, process.env.SECRET, async(err, payload) => {
            if (err) {
                res.status(401).json(err)
                // Admin skall kunna se allas orderhistorik.
            } else if (payload.role === 'admin') {
                const orders = await Order.find({});
                res.send(orders)
                // Användare ser enbart sin orderhistorik.
            } else if (payload.role === 'customer') {
                // Tillfällig array dit vi pushar in produkter som beställs. 
                const orderProducts = [];
                // Här hämtar vi usern från DB.
                const user = await User.findOne({ "user.email": payload.email });
                
                // Async funktion för att kunna pusha in ordrar i vår array och skicka tillbaka det till frontenden. 
                async function addToHistory() {
                    for (const id of user.user.orderHistory) {
                        const order = await Order.findById(id)
                        orderProducts.push(order);
                    }
                    res.json(orderProducts)
                } 
                // Här anropar vi funktionen.
                addToHistory();
            }
        })
    }
})

module.exports = router