const express = require('express')
const Song = require('../models/song')
const router = express.Router()

const SONG_ATTRIBUTES = [
  'id', 'title', 'text'
]

const ARTIST_ATTRIBUTES = ['id', 'name']

router.get('/', async (req, res, next) => {
  const songs = await Song
    .query()
    .select(...SONG_ATTRIBUTES)
    .eager('artist')

  res.json({
    error: false,
    data: songs
  })
})

router.get('/:id', async (req, res, next) => {
  res.type('json')
  const song = await Song
    .query()
    .findById(req.params.id)
    .eager('artist')

  let status = 200
  let error = false
  if (song === null) {
    error = 'Song not found'
    status = 404
  }
  res.json({
    error: error,
    status: status,
    data: song
  })
})

module.exports = router
