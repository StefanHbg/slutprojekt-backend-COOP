const express = require('express')
const Product = require('../modules/Product')
const router = express.Router()
const product = require('../products.json');

router.get('/', (req, res) => {
    res.json(product)
})

router.post('/', async (req, res) => {
    const product = await product.push({
        "title": req.body.title,
        "price": req.body.price,
        "shortDesc": req.body.shortDesc,
        "longDesc": req.body.longDesc,
        "imgFile": req.body.imgFile
    })
    if (product) {
        res.status(201).send(product)

    } else {
        res.send('Could not create a product.')
    }
})

router.post('/:id', (req, res) => {
    
})

router.patch('/:id', (req, res) => {
    
})

router.delete('/:id', (req, res) => {
    
})

module.exports = router