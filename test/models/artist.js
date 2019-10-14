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
      Artist.create({ name: 'Bob' }).done(artist => {
        r.add(artist)
        artist.getSongs().done(songs => {
          expect(songs).to.eql([])
          done()
        })
      })
    })

    it('should return an array of songs when the artist has songs', (done) => {
      Artist.create({ name: 'Brian' })
      .done(artist => {
        r.add(artist)
        Song.create({
          title: 'A good song',
          text: 'This is a song'
        })
        .done(song => {
          song.setArtist(artist)
          .done(song => {
            r.add(song)
            artist.countSongs()
            .done(count => {
              expect(count).to.eql(1)
              done()
            })
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