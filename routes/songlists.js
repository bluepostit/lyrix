const express = require('express')
const router = express.Router()
const { SongList, Song } = require('../models')
const { ensureLoggedIn } = require('../authentication')
const {
  StatusCodes,
  checkForDuplicatesForEntity,
  ensureOwnershipForEntity,
  validateIdForEntity,
  validateDataForEntity
} = require('./common')
const { errorHandler } = require('../helpers/errors')
const debug = require('debug')('lyrix:route:songlists')

const SONGLIST_ATTRIBUTES = [
  'title',
  'id'
]

const validateId = validateIdForEntity(SongList)
const validateSongListData = validateDataForEntity(SongList)
const ensureOwnership = ensureOwnershipForEntity('song list')
const checkForDuplicates = checkForDuplicatesForEntity({
  entityClass: SongList,
  fields: ['title']
})

const validateBodySongId = async (req, res, next) => {
  if (!req.body.songId) {
    return next({
      statusCode: StatusCodes.BAD_REQUEST,
      userMessage: 'You must provide a song'
    })
  }
  const song = await Song
    .query()
    .findById(req.body.songId)
  if (!song) {
    return next({
      statusCode: StatusCodes.NOT_FOUND,
      userMessage: 'Song not found'
    })
  }
  req.song = song
  next()
}

const getSonglist = async (id) => {
  const songlist = await SongList
    .query()
    .findById(id)
    .allowGraph('[songs.artist]')
    .withGraphFetched('[songs.artist]')
  return songlist
}

const setSonglist = async (req, res, next) => {
  const songlist = await getSonglist(req.params.id)
  req.songlist = songlist
  next()
}

router.get('/', ensureLoggedIn,
  async (req, res, next) => {
    try {
      const songlists = await req.user
        .$relatedQuery('songLists')
        .select(...SONGLIST_ATTRIBUTES)
        .withGraphFetched('songs')

      res.json({
        status: StatusCodes.OK,
        songlists: songlists
      })
    } catch (e) {
      next(e)
    }
  })

router.get('/count', ensureLoggedIn,
  async (req, res, next) => {
    try {
      const count = await req.user
        .$relatedQuery('songLists')
        .resultSize()

      res.json({
        status: StatusCodes.OK,
        data: count
      })
    } catch (e) {
      next(e)
    }
  })

router.get('/:id', ensureLoggedIn, validateId, setSonglist,
  ensureOwnership,
    async (req, res, next) => {
      res.json({
        status: StatusCodes.OK,
        songlist: req.songlist
      })
    })

router.post('/', ensureLoggedIn, validateSongListData, checkForDuplicates,
  async (req, res, next) => {
    try {
      const list = await req.user
        .$relatedQuery('songLists')
        .insertGraph({
          title: req.body.title
        })
      res.json({
        status: StatusCodes.CREATED,
        id: list.id
      })
    } catch (error) {
      error.userMessage = "Couldn't create the songlist"
      next(error)
    }
  })

router.post('/:id/add-song', ensureLoggedIn, validateId,
  setSonglist, ensureOwnership, validateBodySongId,
  async (req, res, next) => {
    const query = req.songlist
      .$relatedQuery('songs')
      .relate({
        id: req.song.id,
        position: 0
      })
    debug(query.toKnexQuery().toSQL().toNative())
    await query

    const songlist = await getSonglist(req.songlist.id)

    res.json({
      status: StatusCodes.OK,
      songlist: songlist
    })

  })

router.use(errorHandler('song list'))

module.exports = router
