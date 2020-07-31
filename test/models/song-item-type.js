'use strict'

const expect = require('chai').expect
const SongItemType = require('../../models/song-item-type')

console.log(SongItemType)

describe('SongItemType', () => {
  const clearData = async () => {
    await SongItemType.query().delete()
  }

  beforeEach('clear all records', async () => {
    await clearData()
  })

  describe('#constructor()', () => {
    it('should create a new SongItemType', async () => {
      const type = await SongItemType
        .query()
        .insert({ name: 'lyrics-test' })

      const typeCount = await SongItemType
        .query()
        .resultSize()
      expect(typeCount).to.eql(1)
    })
  })
})
