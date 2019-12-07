'use strict'

const expect = require('chai').expect
const RecordManager = require('../record-manager')
const User = require('../../models/user')

describe('User', () => {
  describe('#constructor()', () => {
    it('should create a new user', async () => {
      const bob = await User
        .query()
        .insert({
          email: 'bob@bob.com',
          password: 'safe-and-secure'
        })

      const userCount = await User
        .query()
        .resultSize()

      expect(userCount).to.eql(1)
      expect(bob.id).to.be.at.least(1)
    })
  })

  /** CLEANUP **/

  const deleteAllUsers = async () => {
    await RecordManager.deleteAll('SongListSong')
    await RecordManager.deleteAll('SongList')
    await RecordManager.deleteAll('User')
  }

  beforeEach('clear all records', async () => {
    deleteAllUsers()
  })

  after('clear all records', async () => {
    deleteAllUsers()
  })
})
