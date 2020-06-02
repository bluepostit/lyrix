const { Artist, Song } = require('../models')
const GeniusSongImporter = require('./genius-song-importer')

const insertOrFetchArtist = async (name) => {
  let artist = await Artist
    .query()
    .findOne('name ', 'ilike', `${name}`)
  if (artist === undefined) {
    artist = await Artist
      .query()
      .insert({
        name: name
      })
  }
  return artist
}

const importSong = async (data) => {
  const artist = await insertOrFetchArtist(data.artist)
  const song = await Song
    .query()
    .insert({
      title: data.title,
      text: data.lyrics,
      artist_id: artist.id
    })
  return song
}

const searchForSong = async (query) => {
  const importer = new GeniusSongImporter()
  const data = await importer.search(query)
  console.log(data)

  // Now import it into the database
  return importSong(data)
}

module.exports = {
  search: searchForSong
}
