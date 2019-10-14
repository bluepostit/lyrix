'use strict'

const expect = require('chai').expect
const Artist = require('../../models/index').Artist

describe('Artist', () => {
  var createdRecords = []

  describe('#songs', () => {
    // Cause this to be a synchronous function by passing in 'done'.
    it('should return an empty list when there are no songs', (done) => {
      Artist.create().done(artist => {
        createdRecords.push(artist)
        artist.getSongs().done(songs => {
          expect(songs).to.eql([])
          done()
        })
      })
    })

    it('should return an array of songs when the artist has songs', () => {

    })
  })

  after('clear created records', () => {
    createdRecords.forEach(record => {
      record.destroy()
    })
  })
})