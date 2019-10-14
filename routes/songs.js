const express = require('express')
const db = require('../models/index')
const router = express.Router()

router.get('/', (req, res, next) => {
  db.Song.findAll({
    attributes: ['id', 'title', 'text']
  }).then(songs => res.json({
      error: false,
      data: songs
    }))
    .catch(error => res.json({
      error: true,
      data: [],
      error: error
    }))
})


module.exports = router