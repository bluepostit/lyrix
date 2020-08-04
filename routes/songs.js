const express = require('express')
const router = express.Router()

const { Song } = require('../models')
const { ensureLoggedIn } = require('../authentication')
const { SongsHelper } = require('../helpers/songs')
const { errorHandler } = require('../helpers/errors')
const {
  StatusCodes,
  checkIsAdmin,
  ensureAdmin,
  validateIdForEntity,
  validateDataForEntity
} = require('./common')

const SONG_ATTRIBUTES = [
  'songs.id', 'title', 'text'
]

const ARTIST_ATTRIBUTES = ['artist.id as artist_id', 'artist.name']

const addUserActions = (req, res, next) => {
  const actions = {
    readOne: "/songs/:id",
    readAll: "/songs"
  }
  if (req.isAdmin) {
    actions.create = "/songs"
    actions.edit = '/songs/:id'
    actions.delete = '/songs'
  }
  req.userActions = actions
  next()
}

const setSong = async (req, res, next) => {
  const songId = req.params.id
  const user = req.user
  let query = Song
    .query()
    .findById(songId)
    .withGraphFetched('artist')

  if (user && user.id) {
    query = query
      .withGraphFetched('[songItems.songItemType]')
      .leftJoinRelated('songItems')
      .modifyGraph('songItems', builder => {
        builder.orderBy('title').where({ user_id: user.id })
      })
  }
  const song = await query
  req.song = song
  next()
}

const setSongContext = async (req, res, next) => {
  const context = req.query.context
  const contextId = req.query.contextId
  let nextSong

  switch (context) {
    case 'artist':
      nextSong = await getNextSong(req.song, context)
      break
    case 'songlist':
      nextSong = await getNextSong(req.song, context, contextId)
      break
  }

  if (nextSong) {
    req.song.nextSongId = nextSong.id
  }
  next()
}

const getNextSong = async (song, context, contextId) => {
  let nextSong

  if (context === 'artist') {
    nextSong = await SongsHelper.getNextSongByArtist(song, context)
  } else if (context === 'songlist') {
    nextSong = await SongsHelper.getNextSongBySonglist(song, contextId)
  }
  return nextSong
}

const checkForDuplicates = async (req, res, next) => {
  const body = req.body
  const duplicate = await Song
    .query()
    .first()
    .where({
      title: body.title,
      artist_id: body.artist_id
    })

  if (duplicate) {
    return next({
      type: 'UniqueViolationError',
      userMessage: 'A similar song by that artist already exists'
    })
  }
  next()
}

const sanitize = async (req, res, next) => {
  const body = req.body
  req.sanitizedBody = {
    title: body.title,
    text: body.text,
    artist_id: body.artist_id
  }
  next()
}

const validateId = validateIdForEntity(Song)
const validateSongData = validateDataForEntity(Song)

router.use([checkIsAdmin, addUserActions])

router.get('/', async (req, res, next) => {
  const songs = await Song
    .query()
    .select(...SONG_ATTRIBUTES, ...ARTIST_ATTRIBUTES)
    .withGraphFetched('artist')
    .joinRelated('artist')
    .orderBy(['title', 'artist.name'])

  res.json({
    error: false,
    data: songs,
    actions: req.userActions
  })
})

router.get('/count', async (req, res, next) => {
  const data = await Song
    .query()
    .count()
  const count = parseInt(data[0].count, 10)

  res.json({
    error: false,
    status: 200,
    data: count
  })
})

router.get('/:id', validateId, setSong, setSongContext,
  async (req, res) => {
    res.json({
      status: StatusCodes.OK,
      data: req.song,
      actions: req.userActions
    })
  })

router.post('/', ensureLoggedIn, ensureAdmin, validateSongData,
  checkForDuplicates, sanitize,
    async (req, res, next) => {
      const response = {
        status: StatusCodes.CREATED
      }

      try {
        const song = await Song.query()
          .insert(req.sanitizedBody)
        response.data = song
      } catch (error) {
        return next(error)
      }
      res.json(response)
    })

router.use(errorHandler('song'))

module.exports = router
