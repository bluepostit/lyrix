'use strict'

const expect = require('chai').expect
const db = require('../../models/index')
const Artist = db.Artist
const Song = db.Song

describe('Artist', () => {
  const clearData = (done) => {
    return db.Song.destroy({ where: {}, force: true })
      .then(() => {
        db.Artist.destroy({ where: {}, force: true })
      })
  }

  describe('#getSongs()', () => {
    // Make this a synchronous function by passing in 'done'.
    it('should return an empty list when there are no songs', (done) => {
      Artist.create({ name: 'Bob' })
        .then(artist => artist.getSongs())
        .then(songs => {
          expect(songs).to.eql([])
          done()
        })
    })

    it('should return an array of songs when the artist has songs', (done) => {
      let songArtist = null;
      Artist.create({ name: 'Brian' })
        .then(artist => {
          songArtist = artist
          return Song.create({
            title: 'A good song',
            text: 'This is a song',
            ArtistId: artist.id
          }, {
            include: [{ model: db.Artist }]
          })
        }).then(song => songArtist.countSongs())
        .then(count => {
          expect(count).to.eql(1)
          done()
        })
    })

    beforeEach('clear all records', (done) => {
      clearData().then(() => done())
    })

    after('clear all records', (done) => {
      clearData().then(() => done())
    })
  })
}