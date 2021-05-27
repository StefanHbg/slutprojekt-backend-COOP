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
                    const products = await Product.find({ _id: { $in: items } });

                    // Skapar en variabel där vi lagrar det totala priset på ordervärdet. Vi loopar sedan igenom req.body.items eftersom att Product.find({}) ignorerar om det är flera av samma produkt. 
                    let orderValue = 0;
                    req.body.items.forEach(productID =>{
                        // Kollar i products(rad 25) och kollar hur många gånger just den produkten finns i items. Med andra ord sätter vi det första hittade Index på en produkt från de valda _id.
                        const index = products.findIndex(product => product._id.toString() === productID); 
                        // Hämtar ut priset och lagrar i variabeln price. 
                        const price = products[index].price 
                        // Summerar priset.
                        orderValue += price;
                    })
                    // Skapar en ny order och räkna ihop summan av produkterna. 
                    const newOrder = await new Order({
                        timeStamp: Date.now(),
                        status: 'inProcess',
                        items: items,
                        orderValue: orderValue
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