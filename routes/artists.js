const express = require('express')
const router = express.Router()

const Artist = require('../models/song')
const songsRouter = require('./artist-songs.js')

const ARTIST_ATTRIBUTES = ['id', 'name']
const SONG_ATTRIBUTES = ['id', 'title', 'text']

router.get('/', async (req, res, next) => {
  const artists = await Artist
    .query()
    .select(...ARTIST_ATTRIBUTES)
  res.json({
    error: false,
    data: artists
  })
})

router.get('/:id', async (req, res, next) => {
  res.type('json')
  const artist = await Artist
    .query()
    .findById(req.params.id)
    .eager('songs')

  let status = 200
  let error = null
  if (artist == null) {
    error = 'Artist not found'
    status = 404
  }

  res.json({
    error: error,
    status: status,
    data: artist
  })
})

router.use('/:id/songs', songsRouter)

module.exports = router
