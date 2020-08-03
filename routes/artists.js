const express = require('express')
const router = express.Router()

const { Artist } = require('../models')
const { ensureLoggedIn } = require('../authentication')
const {
  StatusCodes,
  checkIsAdmin,
  ensureAdmin,
  validateIdForEntity
} = require('./common')
const songsRouter = require('./artist-songs.js')

const ARTIST_ATTRIBUTES = ['artists.id', 'artists.name']
const SONG_ATTRIBUTES = ['id', 'title', 'text']

const validateArtistData = async (req, res, next) => {
  try {
    // Trigger model class's validation rules
    await Artist.fromJson(req.body)
    await next()
  } catch (e) {
    return res.json({
      status: StatusCodes.BAD_REQUEST,
      error: 'Invalid input',
      message: e.message
    })
  }
}

const checkForDuplicates = async (req, res, next) => {
  const body = req.body
  const duplicate = await Artist
    .query()
    .first()
    .where('name', 'like', `%${body.name}%`)

  if (duplicate) {
    return res.json({
      status: StatusCodes.BAD_REQUEST,
      error: 'Invalid input',
      message: `A similar artist (${duplicate.name}) already exists`
    })
  }
  next()
}

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
      error: false,
      data: artists,
      actions: req.userActions
    })
  } catch (error) {
    console.log(error.stack)
  }
})

router.get('/:id', async (req, res, next) => {
  res.type('json')
  let status = 200
  let error = null
  let data = null

  try {
    const artist = await Artist
      .query()
      .findById(req.params.id)
      .withGraphFetched('songs')

    if (artist == null) {
      error = 'Artist not found'
      status = 404
    } else {
      data = artist
    }
  } catch (err) {
    console.log(err.stack)
    error = "Something went wrong"
    status = 500
  }

  res.json({
    error,
    status,
    data,
    actions: req.userActions
  })
})

router.post('/', ensureLoggedIn, ensureAdmin, validateArtistData,
  checkForDuplicates, sanitize,
    async (req, res, next) => {
      const response = {
        status: StatusCodes.CREATED
      }

      try {
        const body = req.body
        const artist = await Artist.query()
          .insert(req.sanitizedBody)
        response.data = artist
      } catch (error) {
        console.log(error)
        console.log(error.stack)
        response.status = StatusCodes.INTERNAL_SERVER_ERROR
        response.error = "Couldn't create the artist"
      }
      res.json(response)
    })

router.delete('/:id', ensureLoggedIn, ensureAdmin, validateId)
router.delete('/', validateId)

router.use('/:id/songs', songsRouter)


module.exports = router
