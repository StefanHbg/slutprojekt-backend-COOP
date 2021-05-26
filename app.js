const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

const orders = require('./routes/orders');
const products = require('./routes/products');
const register = require('./routes/register');
const auth = require('./routes/auth');

// Olika middlewares för att vår applikation skall funka förutom rad 14 (vår dotenv) där vi lagrar vår secret. 
app.use(express.static('public') )
app.use(express.json());
require('dotenv').config() 
app.use(cookieParser())

// Läsa från req.body
app.use(express.urlencoded({ extended: true }))

// Koppla upp mot databas
const url = 'mongodb://localhost:27017';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, dbName: 'sinusDB' })

// Ett "handtag" till vår uppkoppling
const db = mongoose.connection

// Felhantering
db.on('error', (err) => {
    console.error(err)
})

// Starta upp en db-koppling
db.once('open', () => {
    console.log('Startat en uppkoppling mot db.')
})

// Routes
app.use('/api/register', register);
app.use('/api/auth', auth)
app.use('/api/products', products);
app.use('/api/orders', orders);

module.exports = app