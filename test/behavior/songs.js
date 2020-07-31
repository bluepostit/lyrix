const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
const app = require('../../app')

const { Artist, Song, User } = require('../../models')
const RecordManager = require('../record-manager')

chai.use(chaiHttp)

const TEST_USER_DATA = {
  email: 'bob-songlist@bob.bob',
  password: 'safe-and-secure'
}

const TEST_SONGLIST_AND_SONG_DATA = {
  title: 'SongList 1',
  songs: [
    {
      title: 'List1 > Song1',
      text: 'List1 > Song1',

      artist: {
        name: 'Artist 1'
      }
    },
    {
      title: 'List1 > Song2',
      text: 'List1 > Song2',

      artist: {
        name: 'Artist 2'
      }
    }
  ]
}


const insertTwoSongsWithArtists = async () => {
  return Song
    .query()
    .insertGraph([
      {
        title: 'Song 1',
        text: 'This is Song 1',

        artist: {
          name: 'Bobby'
        }
      }, {
        title: 'Song 2',
        text: 'This is Song 2',

        artist: {
          name: 'Sue'
        }
      }
    ])
}

const insertArtistWithTwoSongs = async () => {
  return Artist
    .query()
    .insertGraph(
      {
        name: 'Bobby',
        songs: [
          {
            title: 'Song 1',
            text: 'This is Song 1'
          },
          {
            title: 'Song 2',
            text: 'This is Song 2'
          }
        ]
      }
    )
}

const insertUser = async () => {
  return User.createUser(TEST_USER_DATA)
}

const insertUserSonglistWithTwoSongs = async (user) => {
  const list = await user
    .$relatedQuery('songLists')
    .insertGraph(TEST_SONGLIST_AND_SONG_DATA)
  return list
}


describe('/songs', () => {
  beforeEach(async () => {
    await RecordManager.deleteAll()
  })
  after(async () => {
    await RecordManager.deleteAll()
  })

  describe('GET /songs', () => {
    it('should return a list of all songs in the database', async () => {
      await RecordManager.loadFixture('songs')
      const songs = await Song
        .query()
        .joinRelated('artist')
        .withGraphFetched('artist')
        .orderBy(['title', 'artist.name'])

      const res = await chai.request(app).get('/songs')
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('object')
      const data = res.body.data
      const data0 = data[0]
      expect(data.length).to.eql(songs.length)
      expect(data0.title).to.eql(songs[0].title)
      expect(data0.artist).to.be.an('object')
      expect(data0.artist.name).to.be.eql(songs[0].artist.name)
      expect(data[1].text).to.eql(songs[1].text)
    })

    it('should return empty when there are no songs', async () => {
      chai.request(app)
        .get('/songs')
        .end((err, res) => {
          if (err) {
            console.log(err)
          }
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          expect(res.body.data.length).to.eql(0)
        })
    })
  })

  describe('GET /songs/:id', () => {
    it('should return an error when no matching song can be found', async () => {
      chai.request(app)
        .get('/songs/23')
        .end((err, res) => {
          if (err) {
            console.log(err)
          }
          expect(res.body).to.have.status(404)
          expect(res.body).to.be.an('object')
          expect(res.body).to.haveOwnProperty('error')
        })
    })

    it('should return the song with the given id when found', async () => {
      await RecordManager.loadFixture('songs')
      const song = await Song.query().findById(1)

      chai.request(app)
        .get(`/songs/${song.id}`)
        .end((err, res) => {
          if (err) {
            console.log(err)
          }
          expect(res.body).to.have.status(200)
          const data = res.body.data
          expect(data).to.be.an('object')
          expect(data.title).to.eql(song.title)
          expect(data.text).to.eql(song.text)
        })
    })
  })

  describe('GET /songs/:id?context=artist', () => {
    it("should return the song with a link to the artist's next song", async () => {
      const artist = await insertArtistWithTwoSongs()
      const song0 = artist.songs[0]
      const song1 = artist.songs[1]
      const response = await chai.request(app)
        .get(`/songs/${song0.id}?context=artist`)

      const data = response.body.data
      expect(data).to.be.an('object')
      expect(data.id).to.eql(song0.id)
      expect(data.nextSongId).to.eql(song1.id)
    })
    it("should return the song with no link to a next song if this is the artist's last song", async () => {
      const artist = await insertArtistWithTwoSongs()
      const song0 = artist.songs[0]
      const song1 = artist.songs[1]
      const response = await chai.request(app)
        .get(`/songs/${song1.id}?context=artist`)

      const data = response.body.data
      expect(data).to.be.an('object')
      expect(data.id).to.eql(song1.id)
      expect(data.nextSongId).to.eql(null)
    })
  })

  describe('GET /songs/:id?context=songlist&contextId=:songlistId', () => {
    it("should return the song with a link to the next song from the given songlist", async () => {
      const user = await insertUser()
      const list = await insertUserSonglistWithTwoSongs(user)
      const songs = list.songs

      const response = await chai.request(app)
        .get(`/songs/${songs[0].id}?context=songlist&contextId=${list.id}`)
      const data = response.body.data
      expect(data).to.be.an('object')
      expect(data.id).to.eql(songs[0].id)
      expect(data.nextSongId).to.eql(songs[1].id)
    })

    it("should return the song with no link to a next song if this is the last song in the songlist", async () => {
      const user = await insertUser()
      const list = await insertUserSonglistWithTwoSongs(user)
      const songs = list.songs

      const response = await chai.request(app)
        .get(`/songs/${songs[1].id}?context=songlist&contextId=${list.id}`)
      const data = response.body.data
      expect(data).to.be.an('object')
      expect(data.id).to.eql(songs[1].id)
      expect(data.nextSongId).to.eql(null)
    })
  })

  describe('GET /songs/:id?context=songlist', () => {
    it("should return the song with a link to the next song from the list of all songs", async () => {
      const songs = await insertTwoSongsWithArtists()

      const response = await chai.request(app)
        .get(`/songs/${songs[0].id}?context=songlist`)
      const data = response.body.data
      expect(data).to.be.an('object')
      expect(data.id).to.eql(songs[0].id)
      expect(data.nextSongId).to.eql(songs[1].id)
    })

    it("should return the song with no link to a next song if this is the last song", async () => {
      const songs = await insertTwoSongsWithArtists()

      const response = await chai.request(app)
        .get(`/songs/${songs[1].id}?context=songlist`)
      const data = response.body.data
      expect(data).to.be.an('object')
      expect(data.id).to.eql(songs[1].id)
      expect(data.nextSongId).to.eql(null)
    })
  })


  describe('GET /songs/count', () => {
    const expectSongCount = (count) => {
      chai.request(app)
        .get('/songs/count')
        .end((err, res) => {
          if (err) {
            console.log(err)
          }
          expect(res.body).to.have.status(200)
          expect(res.body.data).to.eql(count)
        })
    }
    it('should return zero when there are no songs in the database', async () => {
      expectSongCount(0)
    })

    it('should return the correct count of songs in the database', async () => {
      try {
        await RecordManager.loadFixture('songs')
        const count = await Song.query().resultSize()
        expectSongCount(count)
      } catch (err) {
        console.log(err)
      }
    })
  })
})
