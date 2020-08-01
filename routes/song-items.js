const express = require('express')
const router = express.Router()
const { ValidationError } = require('objection')
const { SongItem } = require('../models')
const { ensureLoggedIn } = require('../authentication')

const checkForDuplicates = async (req, res, next) => {
  const body = req.body
  const duplicate = await SongItem
    .query()
    .where({
      title: body.title,
      song_id: body.songId,
      user_id: body.userId
    })
  if (duplicate) {
    return res.json({
      status: 400,
      error: 'Invalid input',
      message: 'A similar song item already exists'
    })
  }
  next()
}

const newSongItemValidation = async (req, res, next) => {
  const body = req.body
  body.userId = req.user.id
  try {
    // Trigger model class's validation rules
    await SongItem.fromJson(body)
    await next()
  } catch (e) {
    return res.json({
      status: 400,
      error: 'Invalid input',
      message: e.message
    })
  }
}

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

router.post('/', ensureLoggedIn, newSongItemValidation, checkForDuplicates,
    async (req, res, next) => {
      const response = {
        status: 201 // created
      }

      res.json(response)
  })

module.exports = router
