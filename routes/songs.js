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
  validateDataForEntity,
  checkForDuplicatesForEntity
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

const checkForDuplicates = checkForDuplicatesForEntity({
  entityClass: Song,
  fields: ['title', 'artist_id'],
  forUser: false,
  message: 'A similar song by that artist already exists'
})

const sanitize = async (req, res, next) => {
  const body = req.body
  req.sanitizedBody = {
    title: body.title,
    text: body.text,
    artist_id: body.artist_id
  }
  next()
}

const searchSongs = async (req, res, next) => {
  let songs = []
  try {
    if (req.query && req.query.q) {
      songs = await Song
        .query()
        .modify('defaultSelects')
        .modify('fullTextSearch', req.query.q)
    }
  } catch (err) {
    next(err)
  }
  req.searchResults = songs
  next()
}

const validateId = validateIdForEntity(Song)
const validateSongData = validateDataForEntity(Song)

const validateForeignParameters = async (req, res, next) => {
  if (!req.body.artist_id) {
    return next({
      type: 'ConstraintViolationError',
      userMessage: 'Artist is required'
    })
  }
  next()
}

router.use([checkIsAdmin, addUserActions])

router.get('/search', searchSongs, async (req, res, next) => {
  res.json({
    status: StatusCodes.OK,
    songs: req.searchResults
  })
})

router.get('/', async (req, res, next) => {
  const songs = await Song
    .query()
    .select(...SONG_ATTRIBUTES, ...ARTIST_ATTRIBUTES)
    .withGraphFetched('artist')
    .joinRelated('artist')
    .orderBy(['title', 'artist.name'])

  res.json({
    status: StatusCodes.OK,
    songs: songs,
    actions: req.userActions
  })
})

router.get('/count', async (req, res, next) => {
  const data = await Song
    .query()
    .count()
  const count = parseInt(data[0].count, 10)

  res.json({
    status: StatusCodes.OK,
    data: count
  })
})

router.get('/:id', validateId, setSong, setSongContext,
  async (req, res) => {
    res.json({
      status: StatusCodes.OK,
      song: req.song,
      actions: req.userActions
    })
  })

router.post('/', ensureLoggedIn, ensureAdmin, validateForeignParameters,
  validateSongData, checkForDuplicates, sanitize,
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

router.put('/:id', ensureLoggedIn, ensureAdmin, validateId,
  validateForeignParameters, validateSongData, sanitize,
    async (req, res, next) => {
      try {
        const song = await Song
          .query()
          .updateAndFetchById(req.params.id, req.sanitizedBody)
        res.json({
          status: StatusCodes.OK,
          data: song
        })
      } catch (err) {
        err.userMessage = "Couldn't update the song"
        next(err)
      }
    })

router.put('/', validateId)

router.delete('/:id', ensureLoggedIn, ensureAdmin, validateId,
  async (req, res, next) => {
    try {
      await Song.query().deleteById(req.params.id)
      res.json({
        status: StatusCodes.NO_CONTENT
      })
    } catch (error) {
      return next(error)
    }
  })

router.delete('/', validateId)

router.use(errorHandler('song'))

module.exports = router
