const express = require('express')
const Product = require('../modules/Product')
const router = express.Router()
const product = require('../products.json');


router.get('/', (req, res) => {
    res.send(product)
})

router.post('/products', (req, res) => {
    
})

router.post('/products/:id', (req, res) => {
    
})

router.patch('/products/:id', (req, res) => {
    
})

router.delete('/products/:id', (req, res) => {
    
})

module.exports = router