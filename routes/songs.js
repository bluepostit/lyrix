const express = require('express')
const db = require('../models/index')
const router = express.Router()

const SONG_ATTRIBUTES = { attributes: ['id', 'title', 'text'] }

router.get('/', (req, res, next) => {
  db.Song.findAll(SONG_ATTRIBUTES)
    .then(songs => res.json({
      error: false,
      data: songs
    }))
    .catch(error => res.json({
      data: [],
      error: error
    }))
})

router.get('/:id', (req, res, next) => {
  res.type('json')
  db.Song.findByPk(req.params.id, SONG_ATTRIBUTES)
    .then((song) => {
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
})


module.exports = router