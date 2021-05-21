const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

const error404 = require('./routes/error404');
const orders = require('./routes/orders');
const products = require('./routes/products');
const register = require('./routes/register');
const auth = require('./routes/auth');

app.use( express.static('public') )

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

// Fel?
db.on('error', (err) => {
    console.error(err)
})

// Starta upp db-koppling
db.once('open', () => {
    console.log('Startat en uppkoppling mot db.')
})

// Routes
app.use('/api/register', register);
app.use('/api/auth', auth)
app.use('/api/products', products);
app.use('/api/orders', orders);
app.use('/api/*', error404);

module.exports = app