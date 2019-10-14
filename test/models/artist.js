'use strict'

const expect = require('chai').expect
const Artist = require('../../models/index').Artist

describe('Artist', () => {
  describe('#songs', () => {
    it('should return an empty list when there are no songs', () => {
      Artist.create().done(artist => {
        artist.getSongs().done(songs => {
          expect(songs).to.eql([])
        })
      })
    })

    it('should return an array of songs when the artist has songs', () => {
      
    })
  })
})