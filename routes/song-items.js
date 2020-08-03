const express = require('express')
const router = express.Router()
const { StatusCodes, validateIdForEntity } = require('./common')
const { SongItem } = require('../models')
const { ensureLoggedIn } = require('../authentication')

const checkForDuplicates = async (req, res, next) => {
  const body = req.body
  const duplicate = await SongItem
    .query()
    .first()
    .where({
      title: body.title,
      song_id: body.song_id,
      user_id: req.user.id
    })

    if (duplicate) {
    return res.json({
      status: StatusCodes.BAD_REQUEST,
      error: 'Invalid input',
      message: 'A similar song item already exists'
    })
  }
  next()
}

const validateSongItemData = async (req, res, next) => {
  const body = req.body
  body.userId = req.user.id
  try {
    // Trigger model class's validation rules
    await SongItem.fromJson(body)
    await next()
  } catch (e) {
    return res.json({
      status: StatusCodes.BAD_REQUEST,
      error: 'Invalid input',
      message: e.message
    })
  }
}

const validateId = validateIdForEntity(SongItem)

const ensureOwnership = async (req, res, next) => {
  const songItem = req.entity
  if (songItem.user_id !== req.user.id) {
    return res.json({
      status: StatusCodes.FORBIDDEN,
      error: 'Not your song item',
      message: 'The song item you are trying to update does not belong to you'
    })
  }
  next()
}

const sanitize = async (req, res, next) => {
  const body = req.body
  req.sanitizedBody = {
    title: body.title,
    text: body.text,
    song_id: body.song_id,
    song_item_type_id: body.song_item_type_id
  }
  next()
}

const parseIds = async (req, res, next) => {
  const body = req.body
  if (body.song_id) {
    req.body.song_id = Number.parseInt(body.song_id)
  }
  if (body.song_item_type_id) {
    req.body.song_item_type_id =
      Number.parseInt(body.song_item_type_id)
  }
  next()
}

const addUserActions = (req, res, next) => {
  const actions = {
    readOne: '/song-items/:id',
    readAll: '/song-items',
    edit: '/song-items/:id/edit',
    delete: '/song-items/:id'
  }
  req.userActions = actions
  next()
}

router.get('/', ensureLoggedIn, addUserActions,
  async(req, res) => {
    const songItems = await req.user
      .$relatedQuery('songItems')
      .joinRelated('song')
      .withGraphFetched('[song, songItemType]')
      .orderBy(['song.title', 'title'])

      res.json({
        error: false,
        data: songItems,
        actions: req.userActions
    })
})

router.get('/:id', ensureLoggedIn, validateId, ensureOwnership,
  addUserActions,
    async(req, res) => {
      res.type('json')
      let response = {
        status: StatusCodes.OK,
        actions: req.userActions
      }

      try {
        const songItem = await SongItem
          .query()
          .findById(req.params.id)
          .withGraphFetched('[song.artist, songItemType]')

        response.data = songItem
      } catch (err) {
        console.log(err.stack)
        error = "Something went wrong"
        response.status = StatusCodes.INTERNAL_SERVER_ERROR
      }

      res.json(response)
})

router.post('/', ensureLoggedIn, parseIds,
  validateSongItemData, checkForDuplicates, sanitize,
    async (req, res, next) => {
      const response = {
        status: StatusCodes.CREATED
      }

      try {
        const body = req.body
        const songItem = await req.user
          .$relatedQuery('songItems')
          .insertGraph(req.sanitizedBody)
          response.id = songItem.id
      } catch (error) {
        console.log(error)
        console.log(error.stack)
        response.status = StatusCodes.INTERNAL_SERVER_ERROR
        response.error = "Couldn't create the song item"
      }
      res.json(response)
  })

router.put('/:id', ensureLoggedIn, parseIds, validateId, ensureOwnership,
  validateSongItemData, sanitize,
    async (req, res, next) => {
      const response = {
        status: StatusCodes.OK
      }
      try {
        const songItem = await SongItem
          .query()
          .updateAndFetchById(req.params.id, req.sanitizedBody)
          .withGraphFetched('[song.artist, songItemType]')
        response.data = songItem
      } catch (error) {
        response.status = StatusCodes.INTERNAL_SERVER_ERROR
        response.error = "Couldn't update the song item"
      }
      res.json(response)
    })

// Trigger validation for the absent ID - will respond with error
router.put('/', validateId)

router.delete('/:id', ensureLoggedIn, validateId, ensureOwnership,
  async (req, res, next) => {
    const response = {
      status: StatusCodes.NO_CONTENT
    }
    try {
      await SongItem
        .query()
        .deleteById(req.params.id)
    } catch (error) {
      response.status = StatusCodes.INTERNAL_SERVER_ERROR
      response.error = "Couldn't delete the song item"
    }
    res.json(response)
})

// Trigger validation for the absent ID - will respond with error
router.delete('/', validateId)

module.exports = router
