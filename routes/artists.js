const express = require('express')
const router = express.Router()

const { Artist } = require('../models')
const { ensureLoggedIn } = require('../authentication')
const {
  StatusCodes,
  checkForDuplicatesForEntity,
  checkIsAdmin,
  ensureAdmin,
  validateIdForEntity,
  validateDataForEntity
} = require('./common')
const { errorHandler } = require('../helpers/errors')
const songsRouter = require('./artist-songs.js')
const debug = require('debug')('lyrix:route:artists')

const ARTIST_ATTRIBUTES = ['artists.id', 'artists.name']
const SONG_ATTRIBUTES = ['id', 'title', 'text']

const checkForDuplicates = checkForDuplicatesForEntity({
  entityClass: Artist,
  fields: ['name'],
  forUser: false
})

const sanitize = async (req, res, next) => {
  const body = req.body
  req.sanitizedBody = {
    name: body.name
  }
  next()
}

const addUserActions = (req, res, next) => {
  const actions = {
    readOne: "/artists/:id",
    readAll: "/artists"
  }
  if (req.isAdmin) {
    actions.create = "/artists"
    actions.edit = '/artists/:id'
    actions.delete = '/artists'
  }
  req.userActions = actions
  next()
}

const validateId = validateIdForEntity(Artist)
const validateArtistData = validateDataForEntity(Artist)

router.use([checkIsAdmin, addUserActions])

router.get('/', async (req, res, next) => {
  try {
    const artists = await Artist
      .query()
      .select(ARTIST_ATTRIBUTES)
      .count('songs', { as: 'songCount' })
      .leftJoin('songs', 'artists.id', 'songs.artist_id')
      .orderBy('name')
      .groupBy('artists.id')
    res.json({
      status: StatusCodes.OK,
      artists: artists,
      actions: req.userActions
    })
  } catch (error) {
    next(error)
  }
})

router.get('/:id', validateId, async (req, res, next) => {
  try {
    const artist = await Artist
      .query()
      .findById(req.params.id)
      .withGraphFetched('songs(orderByTitle)')

    if (artist == null) {
      return next({
        type: StatusCodes.NOT_FOUND
      })
    }
    res.json({
      status: StatusCodes.OK,
      actions: req.userActions,
      artist: artist
    })
  } catch (err) {
    return next(err)
  }
})

router.post('/', ensureLoggedIn, ensureAdmin, validateArtistData,
  checkForDuplicates, sanitize,
    async (req, res, next) => {
      try {
        const artist = await Artist.query()
          .insert(req.sanitizedBody)
        res.json({
          status: StatusCodes.CREATED,
          data: artist
        })
      } catch (error) {
        error.userMessage = "Couldn't create the artist"
        return next(error)
      }
    })

router.delete('/:id', ensureLoggedIn, ensureAdmin, validateId,
  async (req, res, next) => {
    const songsCount = await req.entity
      .$relatedQuery('songs')
      .resultSize()
    if (songsCount > 0) {
      return next({
        type: 'ForeignKeyViolationError',
        userMessage: "Can't delete this artist: still has songs"
      })
    }
    // Try to delete the artist
    try {
      await Artist
        .query()
        .deleteById(req.params.id)
      res.json({
        status: StatusCodes.NO_CONTENT
      })
    } catch (error) {
      return next({
        error: error,
        type: 'ForeignKeyViolationError',
        userMessage: "Couldn't delete the artist"
      })
    }
  })

router.delete('/', validateId)

router.use('/:id/songs', songsRouter)

router.use(errorHandler('artist'))

module.exports = router
