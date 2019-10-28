const express = require('express')
const db = require('../models/index')

/** Nested routing: artist's songs */
const router = express.Router({mergeParams: true})
/** CREATE a new song: POST /artist/:id/songs/ **/
router.post('/', (req, res, next) => {
  const {
    title,
    text
  } = req.body
  // TO DO: real validation...
  // if (!title || !text) {
  //   throw 'You need to specify title and text'
  // }
  db.Artist.findByPk(req.params.id)
  .then(artist => {
    return db.Song.create({
      title: title,
      text: text,
      ArtistId: artist.id
    })
  })
  .then(() => {
    res.json({
      error: false,
      status: 200,
      data: {}
    })
  })
})

module.exports = router
