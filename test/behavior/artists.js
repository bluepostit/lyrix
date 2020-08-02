const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
const app = require('../../app')
const { Artist } = require('../../models')
const RecordManager = require('../record-manager')
const SessionManager = require('../session-manager')

chai.use(chaiHttp)

describe('/artists', () => {
  beforeEach(async () => {
    await RecordManager.deleteAll()
  })
  after(async () => {
    await RecordManager.deleteAll()
  })

  describe('GET /artists', () => {
    it('should return a list of all artists in the database ordered by name', async () => {
      await RecordManager.loadFixture('artists')
      const artists = await Artist.query().orderBy('name')

      try {
        const res = await chai.request(app)
          .get('/artists')
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('object')

        const data = res.body.data
        expect(data).to.be.an('array')
        expect(data.length).to.eql(artists.length)

        expect(data[0]).to.be.an('object')
        expect(data[1]).to.be.an('object')
        expect(data[0].name).to.eql(artists[0].name)
      } catch (err) {
        console.log(err)
      }
    })

    it('should also return the amount of songs that the artist has', async () => {
      await RecordManager.loadFixture('artist.with-songs')
      const songs = await Artist.relatedQuery('songs')
        .for(1)

      chai.request(app)
        .get('/artists')
        .end((err, res) => {
          if (err) {
            console.log(err.stack)
          }
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')

          const data = res.body.data
          expect(data.length).to.eql(1)
          const artist0 = data[0]
          expect(artist0).to.be.an('object')
          expect(artist0.id).to.eql(1)
          expect(artist0.songCount).to.eql(songs.length)
        })
    })

    it('should return empty when there are no artists', () => {
      chai.request(app)
        .get('/artists')
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

  describe('GET /artists/:id', () => {
    it('should return an error when no matching artist can be found', () => {
      chai.request(app)
        .get('/artists/23')
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
        .get(`/artists/${artist.id}`)
        .end((err, res) => {
          if (err) {
            console.log(err)
          }
          expect(res.body).to.have.status(200)
          expect(res.body.data).to.be.an('object')
          expect(res.body.data.name).to.eql('Brian')
        })
    })

    it('should also return the artist\'s songs', async () => {
      await RecordManager.loadFixture('artist.with-songs')
      const songs = await Artist.relatedQuery('songs')
        .for(1)

      chai.request(app)
        .get('/artists/1')
        .end((err, res) => {
          if (err) {
            console.log(err)
          }
          expect(res.body).to.have.status(200)
          const artist = res.body.data
          expect(artist).to.be.an('object')
          expect(artist.id).to.eql(1)

          const artistSongs = artist.songs
          expect(artistSongs).to.be.an('array')
          expect(artistSongs.length).to.eql(2)
          expect(artistSongs[1].text).to.eql(songs[1].text)
        })
    })
  })

  describe('POST /artists', () => {
    it('should return an error when not signed in', async() => {
      const res = await chai.request(app).post('/artists')
      expect(res.body).to.have.status(401)
    })

    it('should return an error when user is not an admin', async() => {
      const user = await RecordManager.insertUser()
      const agent = await SessionManager.loginAsUser(app, user)

      const res = await agent
        .post('/artists')
        .send({})
      expect(res.body).to.have.status(403)
    })

    it('should return an error when no name is given', async() => {
      const user = await RecordManager.insertUser({ admin: true })
      const agent = await SessionManager.loginAsUser(app, user)

      const res = await agent
        .post('/artists')
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
          .post('/artists')
          .send({ name: artist.name })
        expect(res.body).to.have.status(400)
      })

    it('should create an artist with the given data', async () => {
      const user = await RecordManager.insertUser({ admin: true })
      const agent = await SessionManager.loginAsUser(app, user)

      const res = await agent
        .post('/artists')
        .send({ name: 'Bobby Guitar' })
      expect(res.body).to.have.status(201)
    })
  })
})
