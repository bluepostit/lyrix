const { Artist, Song, SongList } = require('../models')

const getNextSong = (songId, songs) => {
  console.log(`getNextSong(${songId}, ${songs})`)
  console.log(typeof songId)
  console.log(songs)
  let nextSong = null
  const index = songs.findIndex(arrSong => arrSong.id === songId)
  console.log(`found index: ${index}`)
  if (index >= 0 && index < songs.length - 1) {
    nextSong = songs[index + 1]
  }
  return nextSong
}

const SongsHelper = {
  getNextSongByArtist: async (songId) => {
    songId = Number.parseInt(songId, 10)
    console.log(`getNextSongByArtist(${songId})`)
    const song = await Song
      .query()
      .findById(songId)
      .withGraphFetched('[artist.songs]')
    console.log(song)
    const songs = song.artist.songs
    return getNextSong(songId, songs)
  },
  getNextSongBySonglist: async (songId, songlistId) => {
    songId = Number.parseInt(songId, 10)
    if (songlistId != undefined) {
      songlistId = Number.parseInt(songlistId, 10)
    }

    let songs = []
    if (songlistId == undefined) {
      songs = await Song
        .query()
    } else {
      const songlist = await SongList
        .query()
        .findById(songlistId)
        .withGraphFetched('songs')
      songs = songlist.songs
    }
    return getNextSong(songId, songs)
  }
}

module.exports = { SongsHelper }
