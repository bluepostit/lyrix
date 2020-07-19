const { Artist, Song, SongList } = require('../models')

const getNextSong = (song, songs) => {
  console.log(`getNextSong(${song.id}, ${songs})`)
  console.log(songs)
  let nextSong = null
  const index = songs.findIndex(arrSong => arrSong.id === song.id)
  console.log(`found index: ${index}`)
  if (index >= 0 && index < songs.length - 1) {
    nextSong = songs[index + 1]
  }
  console.log('returning next song:')
  console.log(nextSong)
  return nextSong
}

const SongsHelper = {
  getNextSongByArtist: async (song) => {
    console.log(`getNextSongByArtist(${song.id})`)
    const artist = await song
      .$relatedQuery('artist')
      .withGraphFetched('songs')
    console.log(artist)
    return getNextSong(song, artist.songs)
  },
  getNextSongBySonglist: async (song, songlistId) => {
    console.log(`getNextSongBySonglist(${song.id}, ${songlistId})`)
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
      console.log('================== found songlist ===================')
      console.log(songlist)
      songs = songlist.songs
    }
    return getNextSong(song, songs)
  }
}

module.exports = { SongsHelper }
