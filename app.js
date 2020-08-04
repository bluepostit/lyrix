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

// Debug request info if we're running tests and DEBUG env variable is set.
if (process.env.NODE_ENV === 'test' && process.env.DEBUG) {
  app.use((req, res, next) => {
    console.log("\n=== REQUEST ===")
    console.log(`${req.method} ${req.url}`)
    console.log(req.headers)
    next()
  })
}

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')))

// Serve routes with server routers
app.use('/api/artists', require('./routes/artists'))
app.use('/api/songs', require('./routes/songs'))
app.use('/api/songlists', require('./routes/song-lists'))
app.use('/api/song-items', require('./routes/song-items'))
app.use('/api/song-item-types', require('./routes/song-item-types'))
app.use('/api/user', require('./routes/authentication'))

// Fallback routing: respond with the React app's index page.
app.get('*', (req, res) => {
  console.log('serving client home page')
  res.sendFile(path.join(__dirname, 'client/build/index.html'))
})

app.listen(port, () => console.log(`Lyrix server listening on port ${port}`))

module.exports = app
