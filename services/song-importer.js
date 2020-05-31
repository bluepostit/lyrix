const { Song } = require('../models')
const GeniusSongImporter = require('./genius-song-importer')

const searchForSong = async (query) => {
  const importer = new GeniusSongImporter()
  const data = await importer.search(query)

  // Now import it into the database
  const song = await Song
    .query()
    .insertGraph([{
      title: data.title,
      text: data.lyrics,

      artist: {
        name: data.artist
      }
    }])
  return song
}

module.exports = {
  search: searchForSong
}
