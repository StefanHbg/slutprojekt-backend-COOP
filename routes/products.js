const express = require('express')
const Product = require('../modules/Product')
const router = express.Router()
const product = require('../products.json');

router.get('/', (req, res) => {
    res.json(product)
})

router.post('/', (req, res) => {

})

router.post('/:id', (req, res) => {
    
})

router.patch('/:id', (req, res) => {
    
})

router.delete('/:id', (req, res) => {
    
})

module.exports = router