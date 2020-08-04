const express = require('express')
const Genius = (require('genius-lyrics'))
const router = express.Router()
const {
  StatusCodes,
} = require('./common')
const { errorHandler } = require('../helpers/errors')
const { ensureLoggedIn } = require('../authentication')
const { SongImporter } = require('../helpers/song-importer')

const validateSearchParam = async (req, res, next) => {
  const param = req.query.q
  if (param) {
    req.query.q = param.trim()
    return next()
  }
  next({
    statusCode: StatusCodes.BAD_REQUEST,
    userMessage: "Search term can't be empty"
  })
}

const validateSongId = async (req, res, next) => {
  const songId = req.query.sid
  if (songId) {
    req.query.sid = parseInt(songId.trim(), 10)
    if (req.importer.getCachedSong(req.query.sid)) {
      return next()
    }
    return next({
      statusCode: StatusCodes.NOT_FOUND,
      userMessage: 'The song cannot be found. Please search again'
    })
  }
  next({
    statusCode: StatusCodes.BAD_REQUEST,
    userMessage: "Song id can't be empty"
  })
}

const setImporter = async (req, res, next) => {
  const genius = new Genius.Client(process.env.GENIUS_API_KEY)
  const importer = new SongImporter(req.session, genius)
  req.importer = importer
  next()
}


router.get('/search', ensureLoggedIn, validateSearchParam,
  setImporter,
    async (req, res, next) => {
      const songs = await req.importer.search(req)
      res.json({
        status: StatusCodes.OK,
        data: {
          songs
        }
      })
    })

router.get('/import', ensureLoggedIn, setImporter, validateSongId,
  async (req, res, next) => {
    try {
      const song = await req.importer.import(req.query.sid)
      res.json({
        status: StatusCodes.OK,
        data: {
          song: song
        }
      })
    } catch (e) {
      next(e)
    }
  })

router.use(errorHandler('import'))

module.exports = router
