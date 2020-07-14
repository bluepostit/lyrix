const express = require('express')
const router = express.Router()
const { SongList } = require('../models')
const { ensureLoggedIn } = require('../authentication')

const SONGLIST_ATTRIBUTES = [
  'title',
  'id'
]

const createSonglistValidation = (req, res, next) => {
  const body = req.body
  // Is `title` present?
  if (!body.title) {
    return res.json({
      status: 400,
      error: 'Missing fields',
      message: 'Please include a title for your songlist'
    })
  }

  // Check for songlist with the same title
  req.user
    .$relatedQuery('songLists')
    .where('title', '=', body.title)
    .then((data) => {
      if (data.length > 0) {
        return res.json({
          status: 400,
          error: 'Duplicate songlist',
          message: 'You already have a songlist with this name'
        })
      }
      next()
    })
}

router.get('/', ensureLoggedIn,
  async (req, res, next) => {
    const songlists = await req.user
      .$relatedQuery('songLists')
      .select(...SONGLIST_ATTRIBUTES)
      .withGraphFetched('songs')

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
      .allowGraph('[songs.artist]')
      .withGraphFetched('[songs.artist]')

    let status = 200
    let error = false
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

router.post('/', ensureLoggedIn, createSonglistValidation,
  async (req, res, next) => {
    try {
      const list = await req.user
        .$relatedQuery('songLists')
        .insertGraph([
          {
            title: req.body.title
          }
        ])
      res.json({
        status: 201, // created
        id: list[0].id
      })
    } catch (error) {
      console.log(error)
      console.log(error.stack)
      res.json({
        status: 500,
        error: "Couldn't create the songlist"
      })
    }
  })

module.exports = router
