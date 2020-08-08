const express = require('express')
const router = express.Router()
const { SongList } = require('../models')
const { ensureLoggedIn } = require('../authentication')
const {
  StatusCodes,
  checkForDuplicatesForEntity,
  ensureOwnershipForEntity,
  validateIdForEntity,
  validateDataForEntity
} = require('./common')
const { errorHandler } = require('../helpers/errors')

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

const setSongList = async (req, res, next) => {
  const songList = await SongList
    .query()
    .findById(req.params.id)
    .allowGraph('[songs.artist]')
    .withGraphFetched('[songs.artist]')

  req.songList = songList
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

router.get('/:id', ensureLoggedIn, validateId, setSongList,
  ensureOwnership,
    async (req, res, next) => {
      const songList = await SongList
        .query()
        .findById(req.params.id)
        .allowGraph('[songs.artist]')
        .withGraphFetched('[songs.artist]')
      res.json({
        status: StatusCodes.OK,
        data: songList
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

router.use(errorHandler('song list'))

module.exports = router
