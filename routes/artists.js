const express = require('express')
const db = require('../models/index')
const router = express.Router()

const ARTIST_ATTRIBUTES = ['id', 'name']
const SONG_ATTRIBUTES = ['id', 'title', 'text']


router.get('/', (req, res, next) => {
  db.Artist.findAll({
    attributes: ARTIST_ATTRIBUTES
  })
    .then(artists => res.json({
      error: false,
      data: artists
    }))
    .catch(error => {
        console.log(error)
        res.json({
          data: [],
          error: "There was a problem with this request",
          status: 500
        })
    })
})

router.get('/:id', (req, res, next) => {
  res.type('json')
  db.Artist.findByPk(req.params.id, {
    attributes: ['id', 'name', 'songs'],
    include: [{model: db.Song, attributes: SONG_ATTRIBUTES}]
  })
    .then((artist) => {
      let status = 200
      let error = false
      if (artist === null) {
        error = 'Artist not found'
        status = 404
      }
      res.json({
        error: error,
        status: status,
        data: artist
      })
    })
})


module.exports = router