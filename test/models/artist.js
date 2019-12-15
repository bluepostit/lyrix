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

    it('should return an array of songs when the artist has songs', async () => {
      const brian = await Artist
        .query()
        .insert({ name: 'Brian' })

      await brian
        .$relatedQuery('songs')
        .insert({
          title: 'A good song',
          text: 'This is a good song'
        })
      const songs = await brian
        .$relatedQuery('songs')

      expect(songs.length).to.eql(1)
    })

    beforeEach('clear all records', async () => {
      await clearData()
    })

    after('clear all records', async () => {
      await clearData()
    })
  })
})
