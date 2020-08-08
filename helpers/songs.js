const { Artist, Song, SongList } = require('../models')

const getNextSong = (song, songs) => {
  let nextSong = null
  const index = songs.findIndex(arrSong => arrSong.id === song.id)
  if (index >= 0 && index < songs.length - 1) {
    nextSong = songs[index + 1]
  }
  return nextSong
}

const SongsHelper = {
  getNextSongByArtist: async (song) => {
    const artist = await song
      .$relatedQuery('artist')
      .withGraphFetched('songs(onlyId,orderByTitle)')
    return getNextSong(song, artist.songs)
  },
  getNextSongBySonglist: async (song, songlistId) => {
    if (songlistId != undefined) {
      songlistId = Number.parseInt(songlistId, 10)
    }

    let songs = []
    if (songlistId == undefined) {
      songs = await Song
        .query()
        .select('id')
        .orderBy('title')
    } else {
      const songlist = await SongList
        .query()
        .findById(songlistId)
        .withGraphFetched('songs(onlyId)')

      songs = songlist.songs
    }
    return getNextSong(song, songs)
  }
}

module.exports = { SongsHelper }
