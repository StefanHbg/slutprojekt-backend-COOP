const express = require('express')
const { create } = require('../modules/Order')
const Order = require('../modules/Order')
const Product = require('../modules/Product')
const router = express.Router()

//const router = new Router()

router.post('/', async (req, res) => {
    console.log(req.body);
    const orderSum = req.body.items.reduce((acc, id) => {
        const product = Product.findById(id)
        console.log(product);
        return acc + product.price;
    })
    console.log(orderSum);
    const newOrder = new Order({
        timeStamp: Date.now(),
        status: 'inProcess',
        items: [req.body.items],
        orderValue: orderSum
    })
    newOrder.save((err) => {
        if (err) res.json(err)
        else {
            res.json(newOrder);
        }
    })
    //const createdOrder = await Order.create(req.body)
})

router.get('/', async (req, res) => {
    const orders = await Order.find({})
    res.send(orders)
})


module.exports = router