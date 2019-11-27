const express = require('express')
const Artist = require('../models/artist')

/** Nested routing: artist's songs */
const router = express.Router({ mergeParams: true })
/** CREATE a new song: POST /artist/:id/songs/ **/
router.post('/', async (req, res, next) => {
  const {
    title,
    text
  } = req.body
  // TO DO: real validation...
  // if (!title || !text) {
  //   throw 'You need to specify title and text'
  // }
  const artist = await Artist
    .query()
    .findById(req.params.id)

  await artist
    .$relatedQuery('songs')
    .insert({
      title,
      text
    })

  res.json({
    error: false,
    status: 200,
    data: {}
  })
})

module.exports = router
