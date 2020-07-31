'use strict'

const config = require('./config')
const express = require('express')
const app = express()
const path = require('path')
const port = process.env.PORT || 4000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

require('./session').init(app, config)
require('./authentication').init(app)

// Setup node data types for PostgreSQL
// See https://github.com/brianc/node-pg-types#use
var types = require('pg').types
types.setTypeParser(20, function (val) {
  return parseInt(val)
})

// Routes

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')))

// Serve routes with server routers
app.use('/artists', require('./routes/artists'))
app.use('/songs', require('./routes/songs'))
app.use('/songlists', require('./routes/song-lists'))
app.use('/song-items', require('./routes/song-items'))
app.use('/user', require('./routes/authentication'))

// Fallback routing: respond with the React app's index page.
app.get('*', (req, res) => {
  console.log('serving client home page')
  res.sendFile(path.join(__dirname, 'client/build/index.html'))
})

app.listen(port, () => console.log(`Lyrix server listening on port ${port}`))

module.exports = app
