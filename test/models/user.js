'use strict'

const expect = require('chai').expect
const RecordManager = require('../record-manager')
const { User } = require('../../models')

describe('User', () => {
  const TEST_USER_DATA = {
    email: 'test.bob@bob.bob',
    password: '123456'
  }

  const createUser = async (data) => {
    return await User.createUser(data)
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
      const bob = await createUser(TEST_USER_DATA)
      expect(bob.email).to.eql(TEST_USER_DATA.email)
      expect(bob.password).to.not.eql(TEST_USER_DATA.password)
    })
  })

  describe('checkPassword()', () => {
    it('should return true if the correct password is given', async () => {
      const bob = await createUser(TEST_USER_DATA)
      const checkedPassword = await bob.checkPassword(TEST_USER_DATA.password)
      expect(checkedPassword).to.eql(true)
    })

    it('should return false if the wrong password is given', async () => {
      const bob = await createUser(TEST_USER_DATA)
      const checkedPassword = await bob.checkPassword('wrong password')
      expect(checkedPassword).to.eql(false)
    })
  })

  describe('.songItems', () => {
    it('should return empty when user has no song items', async () => {
      const bob = await createUser(TEST_USER_DATA)
      const songItemsCount = await bob
        .$relatedQuery('songItems')
        .resultSize()
      expect(songItemsCount).to.eql(0)
    })

    it("should return the user's song items", async () => {
      const data = [
        {
          title: 'Chords for Song 1',
          text: 'These are chords for Song 1'
        },
        {
          title: 'Chords for Song 2',
          text: 'These are chords for Song 2'
        }
      ]

      const bob = await User
        .query()
        .insertGraph({
            email: TEST_USER_DATA.email,
            password: TEST_USER_DATA.password,

            songItems: [
              {
                title: data[0].title,
                text: data[0].text,
                songItemType: {
                  '#id': 'chords',
                  name: 'chords',
                },
                song: {
                  title: 'song1',
                  text: 'text1',
                  artist: {
                    '#id': 'artist1',
                    name: 'artist1'
                  }
                }
              },
              {
                title: data[1].title,
                text: data[1].text,
                songItemType: {
                  '#ref': 'chords'
                },
                song: {
                  title: 'song2',
                  text: 'text2',
                  artist: {
                    '#ref': 'artist1'
                  }
                }
              }
            ]
          },
          { allowRefs: true }
        )

      const songItems = await bob
        .$relatedQuery('songItems')

      expect(songItems.length).to.eql(2)
      expect(songItems[0].title).to.eql(data[0].title)
      expect(songItems[1].text).to.eql(data[1].text)
    })
  })

  /** CLEANUP **/

  const cleanUp = async () => {
    await RecordManager.deleteAll()
  }

  beforeEach('clear all records', async () => {
    await cleanUp()
  })

  after('clear all records', async () => {
    await cleanUp()
  })
})
