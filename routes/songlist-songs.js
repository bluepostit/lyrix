const express = require('express')
const router = express.Router()
const {
  StatusCodes,
  validateIdForEntity,
} = require('./common')
const { errorHandler } = require('../helpers/errors')
const { SongListSong } = require('../models')
const { ensureLoggedIn } = require('../authentication')

const validateId = validateIdForEntity(SongListSong)

const ensureOwnership = async (req, res, next) => {
  const id = req.params.id
  const songListSong = await SongListSong
    .query()
    .findById(id)
    .joinRelated('songList')
    .where({user_id: req.user.id})

    if (!songListSong) {
      return next({
        statusCode: StatusCodes.FORBIDDEN,
        userMessage: `This songlist item does not belong to you`
      })
    }
    next()
}

router.delete('/:id', ensureLoggedIn, validateId, ensureOwnership,
  async (req, res, next) => {
    try {
      await SongListSong
        .query()
        .deleteById(req.params.id)
      res.json({
        status: StatusCodes.NO_CONTENT
      })
    } catch (error) {
      error.userMessage = "Couldn't delete the songlist item"
      next(error)
    }
  })

router.use(errorHandler('song'))

module.exports = router
