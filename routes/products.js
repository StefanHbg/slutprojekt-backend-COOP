const express = require('express')
const Product = require('../modules/Product')
const router = express.Router()

router.get('/', async (req, res) => {
    const products = await Product.find({});
    res.json(products)
})

router.post('/', async (req, res) => {
    const singleProduct = await Product.create({
        title: req.body.title,
        price: req.body.price,
        shortDesc: req.body.shortDesc,
        longDesc: req.body.longDesc,
        imgFile: req.body.imgFile
    })
    if (singleProduct) {
        res.json({product: singleProduct})
    } else {
        res.send('Could not create a product.')
    }
})

router.patch('/:id', async (req, res) => {
    const singleProduct = await Product.updateOne({
        title: req.body.title,
        price: req.body.price,
        shortDesc: req.body.shortDesc,
        longDesc: req.body.longDesc,
        imgFile: req.body.imgFile
    })
    if (singleProduct) {
        res.send(singleProduct)
    } else {
        res.send('Sorry. Your edit could not be saved.')
    }
})

router.delete('/:id', async (req, res) => {
    const deletedProduct = await Product.findByIdAndRemove({_id: req.params.id})
    if (deletedProduct) {
        res.send(deletedProduct)
    } else {
        res.send('Sorry. You could not delete.')
    }
})

module.exports = router