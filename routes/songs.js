const express = require('express')
const { Song } = require('../models')
const { SongsHelper } = require('../helpers/songs')
const router = express.Router()

const SONG_ATTRIBUTES = [
  'songs.id', 'title', 'text'
]

const ARTIST_ATTRIBUTES = ['artist.id', 'artist.name']

router.get('/', async (req, res, next) => {
  const songs = await Song
    .query()
    .select(...SONG_ATTRIBUTES, ...ARTIST_ATTRIBUTES)
    .withGraphFetched('artist')
    .joinRelated('artist')
    .orderBy(['title', 'artist.name'])

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

const getNextSong = async (song, context, contextId) => {
  let nextSong

  if (context === 'artist') {
    nextSong = await SongsHelper.getNextSongByArtist(song, context)
  } else if (context === 'songlist') {
    nextSong = await SongsHelper.getNextSongBySonglist(song, contextId)
  }
  return nextSong
}

router.get('/:id', async (req, res, next) => {
  res.type('json')
  let song = await getPlainSong(req.params.id)
  let nextSong
  if (song) {
    song.nextSongId = null
  }

  const context = req.query.context
  const contextId = req.query.contextId

  switch(context) {
    case 'artist':
      nextSong = await getNextSong(song, context)
    break
    case 'songlist':
      nextSong = await getNextSong(song, context, contextId)
    break
  }

  if (song && nextSong) {
    song.nextSongId = nextSong.id
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
