const express = require('express')
const router = express.Router()
const { SongItem } = require('../models')
const { ensureLoggedIn } = require('../authentication')


router.get('/', ensureLoggedIn, async(req, res) => {
  const songItems = await req.user
    .$relatedQuery('songItems')
    .withGraphFetched('[song, songItemType]')

    res.json({
      error: false,
      data: songItems
  })
})

module.exports = router
