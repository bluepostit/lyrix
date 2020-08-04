const express = require('express')
const router = express.Router()

const { SongItemType } = require('../models')
const { StatusCodes } = require('./common')
const { errorHandler } = require('../helpers/errors')

const ATTRIBUTES = ['id', 'name']

router.get('/', async (req, res, next) => {
  try {
    const songItemTypes = await SongItemType
      .query()
      .select(ATTRIBUTES)
      .orderBy('name')
    res.json({
      status: StatusCodes.OK,
      data: songItemTypes
    })
  } catch (error) {
    next(error)
  }
})

router.use(errorHandler('song item'))

module.exports = router
