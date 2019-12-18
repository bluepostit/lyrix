'use strict'

const expect = require('chai').expect
const RecordManager = require('../record-manager')
const { User } = require('../../models')

describe('User', () => {
  const TEST_USER_DATA = {
    email: 'test.bob@bob.bob',
    password: '123456'
  }

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

  describe('createUser()', () => {
    it('should create a user and hash its password', async () => {
      const data = TEST_USER_DATA
      const bob = await User.createUser(data)
      expect(bob.email).to.eql(data.email)
      expect(bob.password).to.not.eql(data.password)
    })
  })

  describe('checkPassword()', () => {
    it('should return true if the correct password is given', async () => {
      const data = TEST_USER_DATA
      const bob = await User.createUser(data)
      const checkedPassword = await bob.checkPassword(data.password)
      expect(checkedPassword).to.eql(true)
    })

    it('should return false if the wrong password is given', async () => {
      const data = TEST_USER_DATA
      const bob = await User.createUser(data)
      const checkedPassword = await bob.checkPassword('wrong password')
      expect(checkedPassword).to.eql(false)
    })
  })

  /** CLEANUP **/

  const deleteAllUsers = async () => {
    await RecordManager.deleteAll('SongListSong')
    await RecordManager.deleteAll('SongList')
    await RecordManager.deleteAll('User')
  }

  beforeEach('clear all records', async () => {
    await deleteAllUsers()
  })

  after('clear all records', async () => {
    await deleteAllUsers()
  })
})
