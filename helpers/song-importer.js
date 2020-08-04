class SongImporter {
  constructor(session, genius) {
    this.session = session
    this.genius = genius
  }

  async search(param, limit = 5) {
    const results = await this.genius.tracks.search(
      param,
      { limit: limit }
    )
    // console.log(results)
    const songs = results.map((track => {
      return {
        title: track.title,
        artist: track.artist.name,
        id: track.id
      }
    }))
    this.results = songs
    return songs
  }
}

module.exports = { SongImporter }
