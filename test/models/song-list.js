'use strict'

const expect = require('chai').expect
const { SongList, User } = require('../../models')
const RecordManager = require('../record-manager')

const insertOneEmptySongList = () => {
  return SongList
    .query()
    .insertGraph([
      {
        title: 'A simple song list',
        user: {
          email: 'bob@bob.com',
          password: 'safe-and-secure'
        }
      }
    ])
}

const insertOneSongListWithThreeSongs = () => {
  return SongList
    .query()
    .insertGraph([
      {
        title: 'A simple song list',
        user: {
          email: 'bob@bob.com',
          password: 'safe-and-secure'
        },
        songs: [
          {
            title: 'Song 1',
            text: 'This is song 1'
          },
          {
            title: 'Song 2',
            text: 'This is song 2'
          },
          {
            title: 'Song 3',
            text: 'This is song 3'
          }
        ]
      }
    ])
}

describe('SongList', () => {
  describe('#constructor()', () => {
    it('should create a new song list', async () => {
      await insertOneEmptySongList()
      const count = await SongList
        .query()
        .resultSize()

      expect(count).to.eql(1)
    })
  })

  describe('.user', () => {
    it('should return the song list\'s owner', async () => {
      await insertOneEmptySongList()
      // get the first user
      const user = await User
        .query()
        .first()

      const songList = await SongList
        .query()
        .first()

      expect(songList.user_id).to.eql(user.id)
    })
  })

  describe('.songs', () => {
    it('should return no songs when the song list is empty', async () => {
      await insertOneEmptySongList()

      const songList = await SongList
        .query()
        .withGraphFetched('songs')
        .first()

      expect(songList.songs.length).to.eql(0)
    })

    it('should return the song list\'s songs', async () => {
      await insertOneSongListWithThreeSongs()

      const songList = await SongList
        .query()
        .withGraphFetched('songs')
        .first()

      expect(songList.songs.length).to.eql(3)
      const songs = songList.songs
      expect(songs[0].title).to.eql('Song 1')
      expect(songs[2].text).to.eql('This is song 3')
    })
  })

  describe('.items', () => {
    it('should return no items when the song list is empty', async () => {
      await insertOneEmptySongList()

      const songList = await SongList
        .query()
        .withGraphFetched('items')
        .first()

      expect(songList.items.length).to.eql(0)
    })

    it('should return the song list\'s items', async () => {
      await insertOneSongListWithThreeSongs()

      const songList = await SongList
        .query()
        .withGraphFetched('items .song')
        .first()

      expect(songList.items.length).to.eql(3)
      const items = songList.items
      expect(items[0].song.title).to.eql('Song 1')
      expect(items[2].song.text).to.eql('This is song 3')
    })
  })

  /** CLEANUP **/

  const cleanUp = async () => {
    await RecordManager.deleteAll('SongListSong')
    await RecordManager.deleteAll('SongList')
    await RecordManager.deleteAll('User')
  }

  beforeEach('clear all records', async () => {
    await cleanUp()
  })

  after('clear all records', async () => {
    await cleanUp()
  })
})
