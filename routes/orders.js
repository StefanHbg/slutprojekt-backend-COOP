const express = require('express')
const Order = require('../modules/Order')
const Product = require('../modules/Product')
const User = require('../modules/User')
const router = express.Router()
const jwt = require('jsonwebtoken')

router.post('/', async (req, res) => {
    //console.log(req.body);
    //const user = await User.findOne({name: req.body.customer.name}) //dålig lösning. Vad händer om vi har 2 användare som har samma namn? Vi har inget id vi kan utgå ifrån. ID kommer endast i mongo. 

    let items = req.body.items;
    if (!req.cookies['auth-token']) {
        res.send("Bara för inloggade.")
    } else {
        const token = await req.cookies['auth-token']
        jwt.verify(token, process.env.SECRET, async(err, payload) => {
            if (err) {
                console.log('i 1:a err')
                res.status(401).json(err)
            } else {
                if (payload.role === 'customer') {     
                    //const user = await User.findOne({ "user.email": payload.email });
                    const products = await Product.find({ _id: { $in: items } });

                    const newOrder = await new Order({
                        timeStamp: Date.now(),
                        status: 'inProcess',
                        items: items,
                        orderValue: products.reduce((total, prod) => total + prod.price, 0)
                    })
                    console.log(newOrder);
                    await newOrder.save((err) => {
                        if (err) {
                            console.log('send err')
                            res.json(err)
                        }
                    })
                    
                    const user = await User.findOneAndUpdate(
                        { "user.email": payload.email },
                        { $push: {"user.orderHistory": newOrder._id}},
                        {useFindAndModify: false}
                    );

                    if (user) res.json(newOrder);

                }  else if (payload.role === 'admin') {
                    res.status(401).json(err);
                }  else {
                res.json(err)
            }} 
        })
    }
})  

router.get('/', async (req, res) => {
    if (!req.cookies['auth-token']) {
        res.send("Bara för inloggade.")
    } else {
        const token = await req.cookies['auth-token']
        console.log('tokeeen', token);
        jwt.verify(token, process.env.SECRET, async(err, payload) => {
            console.log('inne i verify');
            if (err) {
                console.log('inne i första if');
                res.status(401).json(err)
            } else if (payload.role === 'admin') {
                console.log('inne i admin');
                const orders = await Order.find({})
                res.send(orders)
            } else if (payload.role === 'customer') {
                const orderProducts = [];
                console.log('payload:', payload);
                const user = await User.findOne({ "user.email": payload.email });

                await user.user.orderHistory.forEach(async(id) => {
                    const order = await Order.findById(id)
                    orderProducts.push(order);
                });
                console.log('inne customer', user);
                setTimeout(()=> {
                    console.log(orderProducts);
                    res.json(orderProducts)
                }, 1000)
            }
        })
    }
})

module.exports = router