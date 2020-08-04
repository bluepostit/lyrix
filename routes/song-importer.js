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
  }
  if (!param) {
    next({
      statusCode: StatusCodes.BAD_REQUEST,
      userMessage: "Search term can't be empty"
    })
  }
  next()
}


router.get('/search', ensureLoggedIn, validateSearchParam,
  async (req, res, next) => {
    const genius = new Genius.Client(process.env.GENIUS_API_KEY)
    const importer = new SongImporter(req.session, genius)
    const songs = await importer.search(req.query.q)
    res.json({
      status: StatusCodes.OK,
      data: {
        songs
      }
    })
  })

router.use(errorHandler('import'))
module.exports = router
