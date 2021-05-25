const express = require('express')
const Product = require('../modules/Product')
const router = express.Router()
const jwt = require('jsonwebtoken')

router.get('/', async (req, res) => {
    const products = await Product.find({});
    res.json(products)
})

router.post('/', async (req, res) => {

    if (!req.cookies['auth-token']) {
        res.send("Bara för inloggade.")
    } else {
        const token = await req.cookies['auth-token']
        jwt.verify(token, process.env.SECRET,async (err, payload) => {
            if (err) {
                res.json(err)
            } else if (payload.role === 'admin') {
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
            } else res.send('You are not an admin')
        })
    }
})

router.patch('/:id', async (req, res) => {
    if (!req.cookies['auth-token']) {
        res.send("Bara för inloggade.")
    } else {
        const token = await req.cookies['auth-token']
        jwt.verify(token, process.env.SECRET,async (err, payload) => {
            if (err) {
                res.json(err)
            } else if (payload.role === 'admin') {
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
            } else res.send('You are not an admin')
        })
    }
})

router.delete('/:id', async (req, res) => {
    if (!req.cookies['auth-token']) {
        res.send("Bara för inloggade.")
    } else {
        const token = await req.cookies['auth-token']
        jwt.verify(token, process.env.SECRET,async (err, payload) => {
            if (err) {
                res.json(err)
            } else if (payload.role === 'admin') {
                const deletedProduct = await Product.findByIdAndRemove({_id: req.params.id})
                if (deletedProduct) {
                    res.send(deletedProduct)
                } else {
                    res.status(401).send('You are not an admin so you cannot delete')
                }
            } else res.send('You are not an admin')
        })
    }
})

module.exports = router