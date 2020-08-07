const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
const app = require('../../app')

const { Artist, Song, SongList, SongItem } = require('../../models')
const RecordManager = require('../record-manager')
const SessionManager = require('../session-manager')

chai.use(chaiHttp)

const BASE_URL = '/api/songs'

describe(BASE_URL, () => {
  beforeEach(async () => {
    await RecordManager.deleteAll()
  })
  after(async () => {
    await RecordManager.deleteAll()
  })

  describe('GET /', () => {
    it('should return a list of all songs in the database', async () => {
      await RecordManager.loadFixture('songs')
      const songs = await Song
        .query()
        .joinRelated('artist')
        .withGraphFetched('artist')
        .orderBy(['title', 'artist.name'])

      const res = await chai.request(app).get(BASE_URL)
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
        .get(BASE_URL)
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

  describe('GET /:id', () => {
    it('should return an error when no matching song can be found', async () => {
      chai.request(app)
        .get(`${BASE_URL}/23`)
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
        .get(`${BASE_URL}/${song.id}`)
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

    it("should return the current user's song items for the song", async () => {
      const songId = 1
      const user = await RecordManager.insertUser({ id: 1 })
      await RecordManager.loadFixture('song-items.with-song-item-types.user-id-1')
      const items = await SongItem
        .query()
        .joinRelated('song')
        .where({song_id: songId})
        .orderBy(['song.title', 'title'])

      const agent = await SessionManager.loginAsUser(app, user)
      const res = await agent.get(`${BASE_URL}/${songId}`)
      agent.close()

      expect(res.body).to.have.status(200)
      const data = res.body.data
      expect(data).to.be.an('object')
      expect(data.songItems).to.be.an('array')
      expect(data.songItems.length).to.eql(items.length)
      expect(data.songItems[0].title).to.eql(items[0].title)
    })

    it("should return no song items for the song if the user has none", async () => {
      const songId = 1
      const userId = 1
      const user = await RecordManager.insertUser({ id: userId })
      await RecordManager.loadFixture('song-items.only-other-user')
      const items = await SongItem
        .query()
        .joinRelated('song')
        .where({ song_id: songId, user_id: userId})
        .orderBy(['song.title', 'title'])
      expect(items.length).to.eql(0)

      const agent = await SessionManager.loginAsUser(app, user)
      const res = await agent.get(`${BASE_URL}/${songId}`)
      agent.close()

      expect(res.body).to.have.status(200)
      const data = res.body.data
      expect(data).to.be.an('object')
      expect(data.songItems).to.be.an('array')
      expect(data.songItems.length).to.eql(items.length)
    })
  })

  describe('GET /:id?context=artist', () => {
    let artist
    beforeEach(async () => {
      await RecordManager.loadFixture('artist.with-songs')
      artist = await Artist
        .query()
        .withGraphFetched('songs')
        .first()
    })

    it("should return the song with a link to the artist's next song", async () => {
      const song0 = artist.songs[0]
      const song1 = artist.songs[1]
      const response = await chai.request(app)
        .get(`${BASE_URL}/${song0.id}?context=artist`)

      const data = response.body.data
      expect(data).to.be.an('object')
      expect(data.id).to.eql(song0.id)
      expect(data.nextSongId).to.eql(song1.id)
    })

    it("should return the song with no link to a next song if this is the artist's last song", async () => {
      const song1 = artist.songs[1]
      const response = await chai.request(app)
        .get(`${BASE_URL}/${song1.id}?context=artist`)

      const data = response.body.data
      expect(data).to.be.an('object')
      expect(data.id).to.eql(song1.id)
      expect(data).not.to.haveOwnProperty('nextSongId')
    })
  })

  describe('GET /:id?context=songlist&contextId=:songlistId', () => {
    let list
    let songs
    beforeEach(async () => {
      await RecordManager.insertUser({ id: 1 })
      await RecordManager.loadFixture('songlists.with-user-id-1')
      // const agent = await SessionManager.loginAsUser(app, user)
      list = await SongList
        .query()
        .withGraphFetched('songs')
        .joinRelated('items')
        .orderBy('position')
        .first()
      songs = list.songs
    })

    it("should return the song with a link to the next song from the given songlist", async () => {
      const response = await chai.request(app)
        .get(`${BASE_URL}/${songs[0].id}?context=songlist&contextId=${list.id}`)
      const data = response.body.data
      expect(data).to.be.an('object')
      expect(data.id).to.eql(songs[0].id)
      expect(data.nextSongId).to.eql(songs[1].id)
    })

    it("should return the song with no link to a next song if this is the last song in the songlist", async () => {
      const response = await chai.request(app)
        .get(`${BASE_URL}/${songs[1].id}?context=songlist&contextId=${list.id}`)
      const data = response.body.data
      expect(data).to.be.an('object')
      expect(data.id).to.eql(songs[1].id)
      expect(data).not.to.haveOwnProperty('nextSongId')
    })
  })

  describe('GET /:id?context=songlist', () => {
    let songs
    beforeEach(async () => {
      await RecordManager.loadFixture('songs')
      songs = await Song
        .query()
        .joinRelated('artist')
        .orderBy(['title', 'artist.name'])
    })

    it("should return the song with a link to the next song from the list of all songs", async () => {
      const response = await chai.request(app)
        .get(`${BASE_URL}/${songs[0].id}?context=songlist`)
      const data = response.body.data
      expect(data).to.be.an('object')
      expect(data.id).to.eql(songs[0].id)
      expect(data.nextSongId).to.eql(songs[1].id)
    })

    it("should return the song with no link to a next song if this is the last song", async () => {
      const lastSong = songs.slice(-1)[0]

      const response = await chai.request(app)
        .get(`${BASE_URL}/${lastSong.id}?context=songlist`)
      const data = response.body.data
      expect(data).to.be.an('object')
      expect(data.id).to.eql(lastSong.id)
      expect(data).not.to.haveOwnProperty('nextSongId')
    })
  })


  describe('GET /count', () => {
    const expectSongCount = (count) => {
      chai.request(app)
        .get(`${BASE_URL}/count`)
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

  describe('POST /', () => {
    it('should return an error when not signed in', async () => {
      const res = await chai.request(app).post(BASE_URL)
      expect(res.body).to.have.status(401)
    })

    it('should return an error when user is not an admin', async () => {
      const user = await RecordManager.insertUser()
      const agent = await SessionManager.loginAsUser(app, user)

      const res = await agent
        .post(BASE_URL)
        .send({})
      expect(res.body).to.have.status(403)
    })

    it('should return an error when no title is given', async () => {
      const user = await RecordManager.insertUser({ admin: true })
      const agent = await SessionManager.loginAsUser(app, user)

      const res = await agent
        .post(BASE_URL)
        .send({})
      expect(res.body).to.have.status(400)
    })

    it('should return an error when an invalid artist is given', async () => {
      const user = await RecordManager.insertUser({ admin: true })
      const agent = await SessionManager.loginAsUser(app, user)

      const res = await agent
        .post(BASE_URL)
        .send({
          title: 'This is a song',
          text: 'This is some text. It is different',
          artist_id: 1
        })
      expect(res.body).to.have.status(400)
    })

    it('should return an error when no artist is given', async () => {
      const user = await RecordManager.insertUser({ admin: true })
      const agent = await SessionManager.loginAsUser(app, user)

      const res = await agent
        .post(BASE_URL)
        .send({
          title: 'This is a song',
          text: 'This is some text. It is different',
        })
      expect(res.body).to.have.status(400)
      expect(res.body.error).to.match(/missing|provide|require/)
    })

    it('should return an error when a song with the same title exists',
      async () => {
        await RecordManager.loadFixture('songs')
        const song = await Song.query().first()
        const user = await RecordManager.insertUser({ admin: true })
        const agent = await SessionManager.loginAsUser(app, user)

        const res = await agent
          .post(BASE_URL)
          .send({
            title: song.title,
            text: 'This is some text. It is different',
            artist_id: song.artist_id
          })
        expect(res.body).to.have.status(400)
        expect(res.body.error).to.match(/exists/)
      })

    it('should create a song with the given data', async () => {
      await RecordManager.loadFixture('artists')
      const artist = await Artist.query().first()
      const user = await RecordManager.insertUser({ admin: true })
      const agent = await SessionManager.loginAsUser(app, user)
      let songCount = await Song.query().resultSize()
      expect(songCount).to.eql(0)

      const res = await agent
        .post(BASE_URL)
        .send({
          title: 'This is a song title',
          text: 'This is some text. It is different',
          artist_id: artist.id
        })
      expect(res.body).to.have.status(201)
      songCount = await Song.query().resultSize()
      expect(songCount).to.eql(1)
    })

  })

  describe('PUT /:id', () => {
    it('should return an error when not signed in', async () => {
      chai.request(app).put(`${BASE_URL}/1`)
        .send({ title: 'test' })
        .end((err, res) => {
          if (err) {
            console.log(err)
          }
          expect(res.body).to.have.status(401)
        })
    })

    it("should return an error when the user is not an admin",
      async () => {
        await RecordManager.loadFixture('songs')
        const song = await Song.query().first()
        const user = await RecordManager.insertUser()
        const agent = await SessionManager.loginAsUser(app, user)

        const res = await agent.put(`${BASE_URL}/${song.id}`)
        agent.close()

        const body = res.body
        expect(body).to.have.status(403)
      })

    it('should return an error when no id is given', async () => {
      const user = await RecordManager.insertUser({ admin: true })
      const agent = await SessionManager.loginAsUser(app, user)
      const res = await agent.put(BASE_URL)

      const body = res.body
      expect(body).to.have.status(400)
      expect(body.error).to.not.be.empty
    })

    it('should return an error when no song can be found with the given id',
      async () => {
        const user = await RecordManager.insertUser({ admin: true })
        const agent = await SessionManager.loginAsUser(app, user)
        const res = await agent
          .put(`${BASE_URL}/1`)
          .send({})

        const body = res.body
        expect(body).to.have.status(404)
      })

    it('should return an error when text is too short', async () => {
      const user = await RecordManager.insertUser({ admin: true })
      await RecordManager.loadFixture('songs')
      const song = await Song.query().first()

      const agent = await SessionManager.loginAsUser(app, user)
      const data = {
        title: song.title,
        text: 'a',
        artist_id: song.artist_id
      }

      const res = await agent
        .put(`${BASE_URL}/${song.id}`)
        .send(data)
      const body = res.body
      expect(body).to.have.status(400)
      expect(body.error).to.not.be.empty
      expect(body.error).to.match(/text.*short/i)
    })

    it('should update the song with the given data', async () => {
      const user = await RecordManager.insertUser({ admin: true })
      await RecordManager.loadFixture('songs')
      const songs = await Song.query()
      const song = songs[0]

      const agent = await SessionManager.loginAsUser(app, user)
      const data = {
        title: song.title + ' v2',
        text: song.text,
        artist_id: song.artist_id
      }

      const res = await agent
        .put(`${BASE_URL}/${song.id}`)
        .send(data)
      const body = res.body

      expect(body).to.have.status(200)
      expect(body.data).to.be.an('object')
      expect(body.data.title).to.eql(data.title)

      const countAfter = await Song.query().resultSize()
      expect(countAfter).to.eql(songs.length)
    })
  })

  describe('DELETE /:id', () => {
    it('should return an error when not signed in', async () => {
      chai.request(app).delete(`${BASE_URL}/1`)
        .end((err, res) => {
          if (err) {
            console.log(err)
          }
          expect(res.body).to.have.status(401)
        })
    })

    it('should return an error when no id is given', async () => {
      const user = await RecordManager.insertUser()
      const agent = await SessionManager.loginAsUser(app, user)
      const res = await agent.delete(BASE_URL)

      const body = res.body
      expect(body).to.have.status(400)
      expect(body.error).to.not.be.empty
    })

    it('should return an error when user is not an admin', async () => {
      await RecordManager.loadFixture('songs')
      const song = await Song.query().first()
      const user = await RecordManager.insertUser()
      const agent = await SessionManager.loginAsUser(app, user)

      const res = await agent
        .delete(`${BASE_URL}/${song.id}`)
      expect(res.body).to.have.status(403)
    })

    it('should return an error when no song can be found with the given id',
      async () => {
        const user = await RecordManager.insertUser({ admin: true })
        const agent = await SessionManager.loginAsUser(app, user)
        const res = await agent
          .delete(`${BASE_URL}/1`)

        const body = res.body
        expect(body).to.have.status(404)
      })

    it('should delete the song with the given id', async () => {
      await RecordManager.loadFixture('songs')
      const songs = await Song.query()
      const user = await RecordManager.insertUser({ admin: true })
      const agent = await SessionManager.loginAsUser(app, user)

      const res = await agent
        .delete(`${BASE_URL}/${songs[0].id}`)
      const body = res.body

      expect(body).to.have.status(204) // no content

      const countAfter = await Song.query().resultSize()
      expect(countAfter).to.eql(songs.length - 1)
    })
  })

  describe('User Actions', () => {
    it('should provide a visitor with a link to view a song', async () => {
      const res = await chai.request(app).get(BASE_URL)
      const body = res.body
      expect(body.actions).to.be.an('object')
      expect(body.actions).to.have.property('readOne')
    })

    it('should not provide a non-admin user with destructive links',
      async () => {
        const user = await RecordManager.insertUser()
        const agent = await SessionManager.loginAsUser(app, user)

        const res = await agent.get(BASE_URL)
        const body = res.body
        expect(body.actions).to.be.an('object')
        expect(body.actions).not.to.have.property('create')
        expect(body.actions).not.to.have.property('edit')
        expect(body.actions).not.to.have.property('delete')
      })

    it('should provide an admin user with destructive links',
      async () => {
        const user = await RecordManager.insertUser({ admin: true })
        const agent = await SessionManager.loginAsUser(app, user)

        const res = await agent.get(BASE_URL)
        const body = res.body
        expect(body.actions).to.be.an('object')
        expect(body.actions).to.have.property('create')
        expect(body.actions).to.have.property('edit')
        expect(body.actions).to.have.property('delete')
      })
  })
})
