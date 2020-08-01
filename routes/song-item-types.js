const express = require('express')
const router = express.Router()

const { SongItemType } = require('../models')

const ATTRIBUTES = ['id', 'name']

router.get('/', async (req, res, next) => {
  try {
    const songItemTypes = await SongItemType
      .query()
      .select(ATTRIBUTES)
      .orderBy('name')
    res.json({
      error: false,
      data: songItemTypes
    })
  } catch (error) {
    console.log(error.stack)
  }
})

module.exports = router
