'use strict'

const express = require('express')
const app = express()
const port = process.env.APP_PORT || 4000

const songs = require('./routes/songs')

app.use('/songs', songs)

app.listen(port, () => console.log(`Lyrix listening on port ${port}`))

module.exports = app