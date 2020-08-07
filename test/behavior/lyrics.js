const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
const app = require('../../app')
const { Artist } = require('../../models')
const RecordManager = require('../record-manager')
const SessionManager = require('../session-manager')

chai.use(chaiHttp)

const BASE_URL = '/api/lyrics'
const REQUEST_TIMEOUT = 10000 // milliseconds

describe(BASE_URL, function() {
  beforeEach(async () => {
    await RecordManager.deleteAll()
  })
  after(async () => {
    await RecordManager.deleteAll()
  })

  this.timeout(REQUEST_TIMEOUT)

  describe('GET /', () => {
    it('should return an error if not signed in', async () => {
      const res = await chai.request(app).get(BASE_URL)
      expect(res.body).to.have.status(401)
    })

    it('should return an error if no artist id is given', async () => {
      const user = await RecordManager.insertUser()
      const agent = await SessionManager.loginAsUser(app, user)

      const res = await agent.get(BASE_URL)
      expect(res.body).to.have.status(400)
      expect(res.body.error).to.match(/missing|(not found)/)
    })

    it('should return an error if no artist matches the given id',
      async () => {
        const user = await RecordManager.insertUser()
        const agent = await SessionManager.loginAsUser(app, user)

        const res = await agent.get(`${BASE_URL}?artist_id=1`)
        expect(res.body).to.have.status(404)
        expect(res.body.error).to.match(/provided|(not found)/)
      })

    it('should return an error if no title is given', async () => {
      await RecordManager.loadFixture('artists.with-real-names')
      const artist = await Artist.query().first()
      const user = await RecordManager.insertUser()
      const agent = await SessionManager.loginAsUser(app, user)

      const res = await agent.get(
        `${BASE_URL}?artist_id=${artist.id}&title=`)
      expect(res.body).to.have.status(400)
      expect(res.body.error).to.match(/provided|(not found)/)
    })

    it('should return an error when no lyrics are found', async () => {
      await RecordManager.loadFixture('artists.coldplay')
      const artist = await Artist.query().first()
      const title = 'zzzzzzzzzzzz'
      const user = await RecordManager.insertUser()
      const agent = await SessionManager.loginAsUser(app, user)

      const res = await agent.get(
        `${BASE_URL}?artist_id=${artist.id}&title=${title}`)
      expect(res.body).to.have.status(404)
    })

    it('should return lyrics for a found song', async () => {
      await RecordManager.loadFixture('artists.coldplay')
      const artist = await Artist.query().first()
      const title = 'The Scientist'
      const user = await RecordManager.insertUser()
      const agent = await SessionManager.loginAsUser(app, user)

      const res = await agent.get(
        `${BASE_URL}?artist_id=${artist.id}&title=${title}`)
      expect(res.body).to.have.status(200)
      const data = res.body.data
      expect(data.artist).to.match(/coldplay/i)
      expect(data.title).to.match(new RegExp(title, 'i'))
      expect(data.lyrics).to.match(/questions of science/i)
    })
  })
})
