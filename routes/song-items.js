const express = require('express')
const router = express.Router()
const { StatusCodes, validateIdForEntity } = require('./common')
const { errorHandler } = require('../helpers/errors')
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
    return next({
      type: 'UniqueViolationError',
      userMessage: 'A similar song item already exists'
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
    return next(e)
  }
}

const validateId = validateIdForEntity(SongItem)

const ensureOwnership = async (req, res, next) => {
  const songItem = req.entity
  if (songItem.user_id !== req.user.id) {
    return next({
      statusCode: StatusCodes.FORBIDDEN,
      userMessage: 'The song item you are trying to update does not belong to you'
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
        data: songItems,
        actions: req.userActions
    })
})

router.get('/:id', ensureLoggedIn, validateId, ensureOwnership,
  addUserActions,
    async(req, res) => {
      try {
        const songItem = await SongItem
          .query()
          .findById(req.params.id)
          .withGraphFetched('[song.artist, songItemType]')

        res.json({
          status: StatusCodes.OK,
          data: songItem,
          actions: req.userActions
        })
      } catch (err) {
        return next(err)
      }
})

router.post('/', ensureLoggedIn, parseIds,
  validateSongItemData, checkForDuplicates, sanitize,
    async (req, res, next) => {
      try {
        const songItem = await req.user
          .$relatedQuery('songItems')
          .insertGraph(req.sanitizedBody)

        res.json({
          status: StatusCodes.CREATED,
          id: songItem.id
        })
      } catch (error) {
        error.userMessage = "Couldn't create the song item"
        return next(error)
      }
  })

router.put('/:id', ensureLoggedIn, parseIds, validateId, ensureOwnership,
  validateSongItemData, sanitize,
    async (req, res, next) => {
      try {
        const songItem = await SongItem
          .query()
          .updateAndFetchById(req.params.id, req.sanitizedBody)
          .withGraphFetched('[song.artist, songItemType]')
        res.json({
          status: StatusCodes.OK,
          data: songItem
        })
      } catch (error) {
        error.userMessage = "Couldn't update the song item"
        return next(error)
      }
    })

// Trigger validation for the absent ID - will respond with error
router.put('/', validateId)

router.delete('/:id', ensureLoggedIn, validateId, ensureOwnership,
  async (req, res, next) => {
    try {
      await SongItem
        .query()
        .deleteById(req.params.id)
      res.json({
        status: StatusCodes.NO_CONTENT
      })
    } catch (error) {
      error.userMessage = "Couldn't delete the song item"
      return next(error)
    }
})

// Trigger validation for the absent ID - will respond with error
router.delete('/', validateId)

router.use(errorHandler('song'))

module.exports = router
