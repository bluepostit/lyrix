'use strict'

const expect = require('chai').expect
const db = require('../../models/index')
const Artist = db.Artist
const Song = db.Song
const RecordManager = require('../record-manager')

describe('Artist', () => {
  const r = new RecordManager(db)

  describe('#songs', () => {
  // Make this a synchronous function by passing in 'done'.
    it('should return an empty list when there are no songs', (done) => {
      Artist.create().then(artist => {
        r.add(artist)
        artist.getSongs().then(songs => {
          expect(songs).to.eql([])
          done()
        })
      })
    })

    it('should return an array of songs when the artist has songs', (done) => {
      Artist.create().then(artist => {
        r.add(artist)
        Song.create()
          .then(song => song.setArtist(artist))
          .then(song => {
            r.add(song)
            artist.getSongs()
              .then(songs => {
                expect(songs.length).to.eql(1)
                done()
              })
          })
      })
    })

    after('clear created records', (done) => {
      r.destroy('Song')
        .then(() => r.destroy('Artist')
          .then(() => {
            done()
          })
        )
    })
  })
})