const express = require('express')
const Genius = (require('genius-lyrics'))
const router = express.Router()
const {
  StatusCodes,
} = require('./common')
const { errorHandler } = require('../helpers/errors')
const { ensureLoggedIn } = require('../authentication')
const Artist = require('../models/artist')

const validateQueryArtist = async (req, res, next) => {
  let error, statusCode
  if (req.query && req.query.artist_id) {
    try {
      const artist = await Artist
        .query()
        .findById(req.query.artist_id)
      if (artist) {
        req.artist = artist
        return next()
      }
      statusCode = StatusCodes.NOT_FOUND
    } catch (err) {
      console.log('caught error!')
      console.log(err)
      error = err
    }
  }
  next({
    statusCode: statusCode || StatusCodes.BAD_REQUEST,
    error,
    userMessage: "Artist not provided or not found"
  })
}

const validateQueryData = async (req, res, next) => {
    const title = req.query.title
    if (title) {
      req.query.title = title.trim()
    }
    if (!title) {
      next({
        statusCode: StatusCodes.BAD_REQUEST,
        userMessage: "Song title not provided"
      })
    }
    next()
  }

router.get('/', ensureLoggedIn, validateQueryArtist, validateQueryData,
  async (req, res, next) => {
    const artist = req.artist
    const title = req.query.title

    try {
      const genius = new Genius.Client(process.env.GENIUS_API_KEY)
      const results = await genius.tracks.search(
        `${artist.name} ${title}`,
        { limit: 1 }
      )
      const song = results[0]
      const lyrics = await song.lyrics()
      res.json({
        status: StatusCodes.OK,
        data: {
          title: song.title,
          artist: song.artist.name,
          lyrics: lyrics
        }
      })
    } catch (e) {
      let statusCode = StatusCodes.INTERNAL_SERVER_ERROR
      if (e.match && e.match(/no song\(s\) was received/i)) {
        statusCode = StatusCodes.NOT_FOUND
      }
      next({
        statusCode
      })
    }
  })

router.use(errorHandler('lyrics'))

module.exports = router
