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

// Routes

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')))

// Serve routes with server routers
app.use('/artists', require('./routes/artists'))
app.use('/songs', require('./routes/songs'))
app.use('/songlists', require('./routes/song-lists'))
app.use('/user', require('./routes/authentication'))

// Fallback routing: respond with the React app's index page.
app.get('*', (req, res) => {
  console.log('serving client home page')
  res.sendFile(path.join(__dirname, 'client/build/index.html'))
})

app.listen(port, () => console.log(`Lyrix listening on port ${port}`))

module.exports = app
