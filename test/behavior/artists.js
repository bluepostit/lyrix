const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
const app = require('../../app')
const { Artist } = require('../../models')
const RecordManager = require('../record-manager')
const SessionManager = require('../session-manager')

chai.use(chaiHttp)

const BASE_URL = '/api/artists'

describe(BASE_URL, () => {

  beforeEach(async () => {
    await RecordManager.deleteAll()
  })
  after(async () => {
    await RecordManager.deleteAll()
  })

  describe('GET /', () => {
    it('should return a list of all artists in the database ordered by name', async () => {
      await RecordManager.loadFixture('artists')
      const artists = await Artist.query().orderBy('name')

      const res = await chai.request(app)
        .get(BASE_URL)
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('object')

      const data = res.body.artists
      expect(data).to.be.an('array')
      expect(data.length).to.eql(artists.length)

      expect(data[0]).to.be.an('object')
      expect(data[1]).to.be.an('object')
      expect(data[0].name).to.eql(artists[0].name)
    })

    it('should also return the amount of songs that the artist has', async () => {
      await RecordManager.loadFixture('artist.with-songs')
      const songs = await Artist.relatedQuery('songs')
        .for(1)

      chai.request(app)
        .get(BASE_URL)
        .end((err, res) => {
          if (err) {
            console.log(err.stack)
          }
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')

          const data = res.body.artists
          expect(data.length).to.eql(1)
          const artist0 = data[0]
          expect(artist0).to.be.an('object')
          expect(artist0.id).to.eql(1)
          expect(artist0.songCount).to.eql(songs.length)
        })
    })

    it('should return empty when there are no artists', () => {
      chai.request(app)
        .get(BASE_URL)
        .end((err, res) => {
          if (err) {
            console.log(err)
          }
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          expect(res.body.artists.length).to.eql(0)
        })
    })
  })

  describe(`GET /:id`, () => {
    it('should return an error when no matching artist can be found', () => {
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

    it('should return the artist with the given id when found', async () => {
      const artist = await Artist.query().insert({ name: 'Brian' })
      chai.request(app)
        .get(`${BASE_URL}/${artist.id}`)
        .end((err, res) => {
          if (err) {
            console.log(err)
          }
          expect(res.body).to.have.status(200)
          expect(res.body.artist).to.be.an('object')
          expect(res.body.artist.name).to.eql('Brian')
        })
    })

    it('should also return the artist\'s songs', async () => {
      await RecordManager.loadFixture('artist.with-songs')
      const songs = await Artist.relatedQuery('songs')
        .for(1)

      chai.request(app)
        .get(`${BASE_URL}/1`)
        .end((err, res) => {
          if (err) {
            console.log(err)
          }
          expect(res.body).to.have.status(200)
          const artist = res.body.artist
          expect(artist).to.be.an('object')
          expect(artist.id).to.eql(1)

          const artistSongs = artist.songs
          expect(artistSongs).to.be.an('array')
          expect(artistSongs.length).to.eql(2)
          expect(artistSongs[1].text).to.eql(songs[1].text)
        })
    })
  })

  describe('POST /', () => {
    it('should return an error when not signed in', async() => {
      const res = await chai.request(app).post(BASE_URL)
      expect(res.body).to.have.status(401)
    })

    it('should return an error when user is not an admin', async() => {
      const user = await RecordManager.insertUser()
      const agent = await SessionManager.loginAsUser(app, user)

      const res = await agent
        .post(BASE_URL)
        .send({})
      expect(res.body).to.have.status(403)
    })

    it('should return an error when no name is given', async() => {
      const user = await RecordManager.insertUser({ admin: true })
      const agent = await SessionManager.loginAsUser(app, user)

      const res = await agent
        .post(BASE_URL)
        .send({})
      expect(res.body).to.have.status(400)
    })

    it('should return an error when an artist with the same name exists',
      async () => {
        await RecordManager.loadFixture('artists')
        const artist = await Artist.query().first()
        const user = await RecordManager.insertUser({ admin: true })
        const agent = await SessionManager.loginAsUser(app, user)

        const res = await agent
          .post(BASE_URL)
          .send({ name: artist.name })
        expect(res.body).to.have.status(400)
      })

    it('should create an artist with the given data', async () => {
      const user = await RecordManager.insertUser({ admin: true })
      const agent = await SessionManager.loginAsUser(app, user)

      const res = await agent
        .post(BASE_URL)
        .send({ name: 'Bobby Guitar' })
      expect(res.body).to.have.status(201)
    })
  })

  describe('DELETE /:id', () => {
    it('should return an error to a visitor', async () => {
      chai.request(app).delete(`${BASE_URL}/1`)
        .end((err, res) => {
          if (err) {
            console.log(err)
          }
          expect(res.body).to.have.status(401)
        })
    })

    it('should return an error to a non-admin user', async () => {
      const user = await RecordManager.insertUser()
      const agent = await SessionManager.loginAsUser(app, user)

      const res = await agent
        .delete(`${BASE_URL}/1`)
      expect(res.body).to.have.status(403)
    })

    it('should return an error when no artist id is given', async () => {
      const user = await RecordManager.insertUser({ admin: true })
      const agent = await SessionManager.loginAsUser(app, user)

      const res = await agent
        .delete(BASE_URL)
      expect(res.body).to.have.status(400)
    })

    it('should fail if there are songs for the artist', async () => {
      await RecordManager.loadFixture('artist.with-songs')
      const artist = await Artist.query().first()
      const user = await RecordManager.insertUser({ admin: true })
      const agent = await SessionManager.loginAsUser(app, user)

      const res = await agent.delete(`${BASE_URL}/${artist.id}`)
      expect(res.body).to.have.status(400)
    })

    it('should delete an artist with no songs for an admin user', async () => {
      await RecordManager.loadFixture('artists')
      const artist = await Artist.query().first()
      const user = await RecordManager.insertUser({ admin: true })
      const agent = await SessionManager.loginAsUser(app, user)

      const res = await agent.delete(`${BASE_URL}/${artist.id}`)
      expect(res.body).to.have.status(204)
    })
  })

  describe('User Actions', () => {
    it('should provide a visitor with a link to view an artist', async () => {
      const res = await chai.request(app).get(BASE_URL)
      const body = res.body
      expect(body.actions).to.be.an('object')
      expect(body.actions).to.have.property('readOne')
    })

    it('should not provide a non-admin user with a link to create a new artist',
      async () => {
        const user = await RecordManager.insertUser()
        const agent = await SessionManager.loginAsUser(app, user)

        const res = await agent.get(BASE_URL)
        const body = res.body
        expect(body.actions).to.be.an('object')
        expect(body.actions).not.to.have.property('create')
      })

    it('should provide an admin user with a link to create a new artist',
      async () => {
        const user = await RecordManager.insertUser({ admin: true })
        const agent = await SessionManager.loginAsUser(app, user)

        const res = await agent.get(BASE_URL)
        const body = res.body
        expect(body.actions).to.be.an('object')
        expect(body.actions).to.have.property('create')
      })

    it('should not provide links to edit or delete an artist to a visitor', async () => {
      await RecordManager.loadFixture('artists')
      const artist = await Artist.query().first()

      const res = await chai.request(app).get(`${BASE_URL}/${artist.id}`)
      const body = res.body
      expect(body.actions).to.be.an('object')
      expect(body.actions).not.to.have.property('edit')
      expect(body.actions).not.to.have.property('delete')
    })

    it('should not provide links to edit or delete an artist to a non-admin user', async () => {
      await RecordManager.loadFixture('artists')
      const artist = await Artist.query().first()
      const user = await RecordManager.insertUser()
      const agent = await SessionManager.loginAsUser(app, user)

      const res = await agent.get(`${BASE_URL}/${artist.id}`)
      const body = res.body
      expect(body.actions).to.be.an('object')
      expect(body.actions).not.to.have.property('edit')
      expect(body.actions).not.to.have.property('delete')
    })

    it('should provide links to edit or delete an artist to an admin user', async () => {
      await RecordManager.loadFixture('artists')
      const artist = await Artist.query().first()
      const user = await RecordManager.insertUser({ admin: true })
      const agent = await SessionManager.loginAsUser(app, user)

      const res = await agent.get(BASE_URL)
      const body = res.body
      expect(body.actions).to.be.an('object')
      expect(body.actions).to.have.property('edit')
      expect(body.actions).to.have.property('delete')
    })
  })
})
