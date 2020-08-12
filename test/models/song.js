'use strict'

const expect = require('chai').expect
const { Song } = require('../../models')
const RecordManager = require('../record-manager')
const debug = require('debug')('lyrix:test:song')

describe('Song', () => {
  const cleanUp = async () => {
    await RecordManager.deleteAll()
  }
  beforeEach(async () => cleanUp())
  after(async () => cleanUp())


  describe('#fullTextSearch', () => {
    it('should return an empty list when there are no songs', async () => {
      const songs = await Song
        .query()
        .modify('fullTextSearch', 'love')

        expect(songs).to.be.empty
    })

    it('should return an empty list when no songs match the query',
      async () => {
        await RecordManager.loadFixture('songs.matching-search-tea-and-coffee')
        const songs = await Song
          .query()
          .modify('fullTextSearch', 'mechanics')

        expect(songs).to.be.empty
      })

    it('should return a list of songs matching the query', async () => {
      await RecordManager.loadFixture('songs.matching-search-tea-and-coffee')
      const allSongCount = await Song
        .query()
        .resultSize()

      const songs = await Song
        .query()
        .modify('defaultSelects', 'fullTextSearch', 'tea or coffee')

      expect(songs).not.to.be.empty
      expect(songs.length).to.be.greaterThan(0)
      expect(songs.length).to.eql(allSongCount)
      expect(songs[0]).not.to.haveOwnProperty('fulltext')
    })

    it('should not return unrelated songs', async () => {
      await RecordManager.loadFixture('songs.matching-search-tea-and-coffee')
      const allTeaAndCoffeeCount = await Song
        .query()
        .resultSize()
      await RecordManager.loadFixture('songs.matching-search-water')
      const allSongCount = await Song.query().resultSize()
      expect(allSongCount).to.be.greaterThan(allTeaAndCoffeeCount)

      const songs = await Song
        .query()
        .modify('defaultSelects')
        .modify('fullTextSearch', 'tea or coffee')

      expect(songs).not.to.be.empty
      expect(songs.length).to.be.greaterThan(0)
      expect(songs.length).to.eql(allTeaAndCoffeeCount)
    })
  })
})
