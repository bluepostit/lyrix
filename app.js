'use strict'

const express = require('express')
const app = express()
const port = process.env.PORT || 4000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
const artists = require('./routes/artists')
const songs = require('./routes/songs')

app.use('/artists', artists)
app.use('/songs', songs)

app.listen(port, () => console.log(`Lyrix listening on port ${port}`))

module.exports = app
