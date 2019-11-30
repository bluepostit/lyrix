'use strict'

const express = require('express')
const app = express()
const path = require('path')
const port = process.env.PORT || 4000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
const artists = require('./routes/artists')
const songs = require('./routes/songs')

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Serve routes with server routers
app.use('/artists', artists)
app.use('/songs', songs)

// Fallback routing: respond with the React app's index page.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

app.listen(port, () => console.log(`Lyrix listening on port ${port}`))

module.exports = app
