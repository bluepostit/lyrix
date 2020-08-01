const express = require('express')
const router = express.Router()
const { SongItem } = require('../models')
const { ensureLoggedIn } = require('../authentication')


router.get('/', ensureLoggedIn, async(req, res) => {
  const songItems = await req.user
    .$relatedQuery('songItems')
    .joinRelated('song')
    .withGraphFetched('[song, songItemType]')
    .orderBy(['song.title', 'title'])

    res.json({
      error: false,
      data: songItems
  })
})

router.get('/:id', ensureLoggedIn, async(req, res) => {
  res.type('json')
  let response = {
    status: 200
  }

  try {
    const songItem = await SongItem
      .query()
      .findById(req.params.id)
      .withGraphFetched('[song.artist, songItemType]')

    if (!songItem) {
      response.error = 'SongItem not found'
      response.status = 404
    } else if (songItem.user_id != req.user.id) {
      response.error = 'Not authorized'
      response.status = 401
    } else {
      response.data = songItem
    }
  } catch (err) {
    console.log(err.stack)
    error = "Something went wrong"
    response.status = 500
  }

  res.json(response)
})

module.exports = router
