const express = require('express')
const router = express.Router()
const { SongList } = require('../models')
const { ensureLoggedIn } = require('../authentication')

const SONGLIST_ATTRIBUTES = [
  'title',
  'id'
]

router.get('/', ensureLoggedIn,
  async (req, res, next) => {
    const songlists = await req.user
      .$relatedQuery('songLists')
      .select(...SONGLIST_ATTRIBUTES)
      .eager('songs')

    res.json({
      error: false,
      data: songlists
    })
  })

router.get('/count', ensureLoggedIn,
  async (req, res, next) => {
    const data = await req.user
      .$relatedQuery('songLists')
      .count()
    const count = parseInt(data[0].count, 10)

    res.json({
      error: false,
      status: 200,
      data: count
    })
  })

router.get('/:id', ensureLoggedIn,
  async (req, res, next) => {
    res.type('json')
    const songList = await SongList
      .query()
      .findById(req.params.id)
      .eager('songs')

    let status = 200
    let error = false
    // console.log(songList)
    if (songList === undefined) {
      error = 'Song list not found'
      status = 404
    } else if (songList.user_id !== req.user.id) {
      error = 'Not your song list'
      status = 401
    }
    res.json({
      error: error,
      status: status,
      data: songList
    })
  })

module.exports = router
