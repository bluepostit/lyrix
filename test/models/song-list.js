'use strict'

const expect = require('chai').expect
const { SongList, User } = require('../../models')
const RecordManager = require('../record-manager')
const {
  getFirstSonglist,
  getLastSonglist,
  buildItemPositions
} = require('../common')

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

  describe('.orderItems', () => {
    beforeEach(async () => {
      await cleanUp()
      await RecordManager.insertUser({ id: 1 })
      await RecordManager.loadFixture("songlists.for-user-id-1")
    })

    it("should fail when not all songlistSongs are given", async () => {
      const songlist = await getFirstSonglist()
      const orderData = buildItemPositions(songlist).slice(1)

      return songlist.orderItems(orderData)
        .catch(error => expect(error).to.be.an('error')
        .with.property('message', 'Incorrect or missing song item data'))
    })

    it('should fail when not all songlistSongs belong to the songlist', async () => {
      const songlist = await getFirstSonglist()
      const songlist2 = await getLastSonglist()
      const orderData = buildItemPositions(songlist)
      orderData[0].id = songlist2.items[0].id

      return songlist.orderItems(orderData)
        .catch(error => expect(error).to.be.an('error')
        .with.property('message', 'Incorrect or missing song item data'))

    })

    it("should reorder the songlist's songs as specified", async () => {
      // 1. get all songs for the given songlist
      // 2. ensure all given songlistSong ids match those belonging to
      //    the songlist in the db
      // 3. update songlistSongs table with the data
      const songlist = await getFirstSonglist()

      // Reverse the positions of the songListSongs in songlist
      const orderData = buildItemPositions(songlist, (item, songlist) => {
        return songlist.items.length + 1 - item.position
      })

      // Order the items according to the order data
      await songlist.orderItems(orderData)

      const newSonglist = await getFirstSonglist()
      const newData = buildItemPositions(newSonglist)
      expect(orderData).to.eql(newData)
    })
  })

  /** CLEANUP **/

  const cleanUp = async () => {
    await RecordManager.deleteAll('SongListSong')
    await RecordManager.deleteAll('SongList')
    await RecordManager.deleteAll('Song')
    await RecordManager.deleteAll('Artist')
    await RecordManager.deleteAll('User')
  }

  beforeEach('clear all records', async () => {
    await cleanUp()
  })

  after('clear all records', async () => {
    await cleanUp()
  })
})
