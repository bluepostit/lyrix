const debug = require('debug')('lyrix:importer')
const { Artist } = require('../models')

const MAX_LYRICS_FETCH_ATTEMPTS = 3

const selectOrInsertArtist = async (name) => {
  let artist = await Artist
    .query()
    .first()
    .where('name', 'ilike', name)

  if (!artist) {
    debug(`artist '${name}' not found; inserting...`)
    artist = await Artist
      .query()
      .insert({ name })
  }
  return artist
}

/**
 *
 * @param {object} genius an instance of the Genius class
 * @param {int} songId the Genius id for the required song
 */
const getLyrics = async (genius, songId) => {
  const track = await genius.tracks.get(String(songId))
  let lyrics = ''
  for (let i = 0; i < MAX_LYRICS_FETCH_ATTEMPTS; i++) {
    debug(`trying to get lyrics: #${i + 1}`)
    lyrics = await track.lyrics()
    if (lyrics) {
      return lyrics
    }
  }
  return lyrics
}

class SongImporter {
  constructor(session, genius) {
    this.session = session
    this.genius = genius
    this.results = session.songSearchResults || []
  }

  async search(request, limit = 5) {
    const param = request.query.q
    const results = await this.genius.tracks.search(
      param,
      { limit: limit }
    )
    const songs = results.map((track => {
      return {
        title: track.title,
        artist: track.artist.name,
        id: track.id
      }
    }))
    debug('found song results: %O', songs)
    this.results = songs
    request.session.songSearchResults = songs
    return songs
  }

  getCachedSong(id) {
    return this.results.find(e => e.id === id)
  }

  async import(id) {
    const cachedSong = this.getCachedSong(id)
    if (!cachedSong) {
      throw 'Song id not found in cache!'
    }

    const lyrics = await getLyrics(this.genius, cachedSong.id)
    const title = cachedSong.title

    if (!title ||!lyrics) {
      throw {
        userMessage: "Couldn't find all required data to import. "
        + "Please try again."
      }
    }

    const artist = await selectOrInsertArtist(cachedSong.artist)
    const query = artist
      .$relatedQuery('songs')
      .insert({
        title,
        text: lyrics
      })
    debug('%o', query.toKnexQuery().toSQL().toNative())
    return await query
  }
}

module.exports = { SongImporter }
