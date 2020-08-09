const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const app = require('../../app')

const { SongList } = require('../../models')
const RecordManager = require('../record-manager.js')
const SessionManager = require('../session-manager')

const BASE_URL = '/api/songlists'

describe(BASE_URL, async () => {
  beforeEach(async () => {
    await RecordManager.deleteAll()
  })
  after(async () => {
    await RecordManager.deleteAll()
  })

  describe('GET /', () => {
    it('should return an error when not logged in', async () => {
      const res = await chai.request(app)
        .get(BASE_URL)

      expect(res).to.have.status(200)
      expect(res.body).to.have.status(401)
      expect(res.body.error).to.not.be.empty
    })

    it('should return a list of the current user\'s songlists', async () => {
      const user = await RecordManager.insertUser({ id: 1 })
      await RecordManager.loadFixture('songlists.with-user-id-1')
      const songlists = await SongList
        .query()
        .orderBy('title')

      const agent = await SessionManager.loginAsUser(app, user)
      const res = await agent
        .get(BASE_URL)
      agent.close()

      expect(res).to.have.status(200)
      expect(res.body).to.be.an('object')
      expect(res.body).not.to.haveOwnProperty('error')

      const data = res.body.songlists
      expect(data).to.be.an('array')
      expect(data.length).to.eql(songlists.length)
      expect(data[1].title).to.eql(songlists[1].title)
    })
  })

  describe('GET /:id', () => {
    it('should return an error when no matching songlist can be found',
      async () => {
        const user = await RecordManager.insertUser({ id: 1 })
        const agent = await SessionManager.loginAsUser(app, user)

        agent.get(`${BASE_URL}/999999999`)
          .end((err, res) => {
            if (err) {
              console.log(err)
            }
            expect(res.body).to.have.status(404)
            expect(res.body).to.be.an('object')
            expect(res.body).to.haveOwnProperty('error')
            agent.close()
          })
      })

    it('should return the songlist with the given ID when found', async () => {
      const user = await RecordManager.insertUser({ id: 1 })
      await RecordManager.loadFixture('songlists.with-user-id-1')
      const lists = await SongList
        .query()
        .withGraphFetched('songs.artist')
        .orderBy('title')
      const agent = await SessionManager.loginAsUser(app, user)

      await agent.get(`${BASE_URL}/${lists[0].id}`)
        .then(res => {
          expect(res.body).to.have.status(200)
          const data = res.body.songlist

          expect(data.title).to.eql(lists[0].title)
          expect(data.songs).to.be.an('array')
          expect(data.songs.length).to.eql(lists[0].songs.length)

          const song = data.songs[0]
          expect(song.title).to.eql(lists[0].songs[0].title)
          expect(song.artist).to.be.an('object')
          expect(song.artist.name).to.eql(lists[0].songs[0].artist.name)

          agent.close()
        })
    })
  })

  describe('POST /', () => {
    it('should return an error when not signed in', async () => {
      chai.request(app).post(BASE_URL)
        .send({ name: 'test songlist' })
        .end((err, res) => {
          if (err) {
            console.log(err)
          }
          expect(res.body).to.have.status(401)
        })
    })

    it('should return an error when no title is given',
      async () => {
        const user = await RecordManager.insertUser()
        const agent = await SessionManager.loginAsUser(app, user)

        agent.post(BASE_URL)
          .end((err, res) => {
            if (err) {
              console.log(err)
            }
            expect(res.body).to.have.status(400)
            expect(res.body.error).to.not.be.empty
          })
      })

      it('should return an error when an empty title is given',
      async () => {
        const user = await RecordManager.insertUser()
        const agent = await SessionManager.loginAsUser(app, user)

        const res = await agent
          .post(BASE_URL)
          .send({ title: '' })

        expect(res.body).to.have.status(400)
        expect(res.body.error).to.not.be.empty
      })

    it('should return an error when a songlist with this name already exists',
      async () => {
        const user = await RecordManager.insertUser({ id: 1 })
        await RecordManager.loadFixture('songlists.with-user-id-1')
        const list = await SongList.query().first()

        const agent = await SessionManager.loginAsUser(app, user)
        agent.post(BASE_URL)
          .send({ title: list.title })
          .end((err, res) => {
            if (err) {
              console.log(err)
            }
            expect(res.body).to.have.status(400)
          })
      })

    it('should create a new songlist when given valid data', async () => {
      const user = await RecordManager.insertUser({ id: 1 })
      const agent = await SessionManager.loginAsUser(app, user)

      const res = await agent.post(BASE_URL)
        .send({ title: 'a new songlist title' })
      const body = res.body
      expect(body).to.have.status(201) // Created
      expect(body.id).to.match(/^\d+/)
      agent.close()
    })
  })
})
