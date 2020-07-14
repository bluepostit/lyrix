const express = require('express')
const router = express.Router()

const { Artist } = require('../models')
const songsRouter = require('./artist-songs.js')

const ARTIST_ATTRIBUTES = ['id', 'name']
const SONG_ATTRIBUTES = ['id', 'title', 'text']

router.get('/', async (req, res, next) => {
  try {
    const artists = await Artist
      .query()
      .select(ARTIST_ATTRIBUTES)
    res.json({
      error: false,
      data: artists
    })
  } catch (error) {
    console.log(error.stack)
  }
})

router.get('/:id', async (req, res, next) => {
  res.type('json')
  let status = 200
  let error = null
  let data = null

  try {
    const artist = await Artist
      .query()
      .findById(req.params.id)
      .withGraphFetched('songs')

    if (artist == null) {
      error = 'Artist not found'
      status = 404
    } else {
      data = artist
    }
  } catch (err) {
    console.log(err.stack)
    error = "Something went wrong"
    status = 500
  }

  res.json({
    error,
    status,
    data
  })
})

router.use('/:id/songs', songsRouter)

module.exports = router
