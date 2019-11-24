'use strict'

const expect = require('chai').expect
const Artist = require('../../models/artist')
const Song = require('../../models/song')

describe('Artist', () => {
  const clearData = async () => {
    await Song.query().delete()
    await Artist.query().delete()
  }

  describe('#getSongs()', () => {
    it('should return an empty list when there are no songs', async () => {
      const bob = await Artist
        .query()
        .insert({ name: 'Bob' })

      const songs = await bob
        .$relatedQuery('songs')
      expect(songs).to.eql([])
    })

    // it('should return an array of songs when the artist has songs', async () => {
    //   let songArtist = null;
    //   Artist.create({ name: 'Brian' })
    //     .then(artist => {
    //       songArtist = artist
    //       return Song.create({
    //         title: 'A good song',
    //         text: 'This is a song',
    //         ArtistId: artist.id
    //       }, {
    //         include: [{ model: db.Artist }]
    //       })
    //     }).then(song => songArtist.countSongs())
    //     .then(count => {
    //       expect(count).to.eql(1)
    //       done()
    //     })
    // })

    beforeEach('clear all records', async () => {
      await clearData()
    })

    after('clear all records', async () => {
      await clearData()
    })
  })
})
