const express = require('express')
const { Song } = require('../models')
const { SongsHelper } = require('../helpers/songs')
const router = express.Router()

const SONG_ATTRIBUTES = [
  'id', 'title', 'text'
]

const ARTIST_ATTRIBUTES = ['id', 'name']

router.get('/', async (req, res, next) => {
  const songs = await Song
    .query()
    .select(...SONG_ATTRIBUTES)
    .withGraphFetched('artist')

  res.json({
    error: false,
    data: songs
  })
})

router.get('/count', async (req, res, next) => {
  const data = await Song
    .query()
    .count()
  const count = parseInt(data[0].count, 10)

  res.json({
    error: false,
    status: 200,
    data: count
  })
})

const getPlainSong = async (id) => {
  return Song
    .query()
    .findById(id)
    .withGraphFetched('artist')
}

const getSongWithContext = async (id, context, contextId) => {
  const song = await getPlainSong(id)
  song.nextSongId = null
  let nextSong

  console.log(`getSongWithContext(${id}, ${context}, ${contextId})`)
  if (context === 'artist') {
    nextSong = await SongsHelper.getNextSongByArtist(id, context)
  } else if (context === 'songlist') {
    nextSong = await SongsHelper.getNextSongBySonglist(id, contextId)
  }
  if (nextSong) {
    song.nextSongId = nextSong.id
  }
  return song
}

router.get('/:id', async (req, res, next) => {
  res.type('json')
  let songId = req.params.id

  const context = req.query.context
  const contextId = req.query.contextId

  switch(context) {
    case 'artist':
      song = await getSongWithContext(songId, context)
    break
    case 'songlist':
      song = await getSongWithContext(songId, context, contextId)
    break
    case undefined:
      song = await getPlainSong(songId)
    break
  }

  let status = 200
  let error = false
  if (song === undefined) {
    error = 'Song not found'
    status = 404
  }
  res.json({
    error: error,
    status: status,
    data: song
  })
})

module.exports = router
