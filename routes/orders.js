const express = require('express')
const { create } = require('../modules/Order')
const Order = require('../modules/Order')
const router = express.Router()

//const router = new Router()

router.post('/', async (req, res) => {
    console.log(req.body);
    const newOrder = new Order({
        timeStamp: Date.now(),
        status: 'inProcess',
        items: [req.body.items],
        orderValue: ''
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