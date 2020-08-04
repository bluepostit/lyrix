const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const app = require('../../app')
const { Song, SongItem, SongItemType } = require('../../models')
const RecordManager = require('../record-manager')
const SessionManager = require('../session-manager')

const BASE_URL = '/api/song-importer'
const REQUEST_TIMEOUT = 20000 // milliseconds

describe(BASE_URL, async function () {
  this.timeout(REQUEST_TIMEOUT)

  const cleanUp = async () => {
    await RecordManager.deleteAll()
  }

  beforeEach(async () => cleanUp())
  after(async () => cleanUp())

  describe('GET /search', () => {
    it('should return an error if user is not signed in', async () => {
      const res = await chai.request(app).get(`${BASE_URL}/search`)
      expect(res.body).to.have.status(401)
      expect(res.body.error).not.to.be.empty
    })

    it('should return an error if the search term is empty', async () => {
      const user = await RecordManager.insertUser()
      const agent = await SessionManager.loginAsUser(app, user)
      const res = await agent.get(`${BASE_URL}/search`)
      agent.close()

      expect(res.body).to.have.status(400)
      expect(res.body.message).to.match(/missing|empty|search/)
    })

    it('should return a list of songs matching the search term(s)', async () => {
      const user = await RecordManager.insertUser()
      const agent = await SessionManager.loginAsUser(app, user)
      const query = 'britney spears toxic'
      const res = await agent.get(`${BASE_URL}/search?q=${query}`)
      agent.close()

      expect(res.body).to.have.status(200)
      expect(res.body.data).to.be.an('object')
      const songs = res.body.data.songs
      expect(songs.length).to.be.greaterThan(4)

      const song = songs[0]
      expect(song.title).to.match(/toxic/i)
      expect(song.artist).to.match(/britney spears/i)
      expect(song.id).to.match(/\d+/)
    })
  })

  describe('GET /import', function () {
    this.timeout(REQUEST_TIMEOUT * 2)

    const getAgentAfterLogin = async () => {
      const user = await RecordManager.insertUser()
      const agent = await SessionManager.loginAsUser(app, user)
      return agent
    }

    const getSearchedSongs = async (agent) => {
      const query = 'britney spears toxic'
      const res = await agent.get(`${BASE_URL}/search?q=${query}`)
      return res.body.data.songs
    }

    it('should return an error if user is not signed in', async () => {
      const res = await chai.request(app).get(`${BASE_URL}/import`)
      expect(res.body).to.have.status(401)
      expect(res.body.error).not.to.be.empty
    })

    it('should return an error if the song id is empty', async () => {
      const user = await RecordManager.insertUser()
      const agent = await SessionManager.loginAsUser(app, user)
      const res = await agent.get(`${BASE_URL}/import?sid=`)
      agent.close()

      expect(res.body).to.have.status(400)
      expect(res.body.message).to.match(/missing|empty|search/)
    })

    it("should return an error if the song id doesn't match "
       + " one that was returned earlier", async () => {
        const agent = await getAgentAfterLogin()
        await getSearchedSongs(agent)
        const songId = '2'

        const res = await agent.get(`${BASE_URL}/import?sid=${songId}`)
        expect(res.body).to.have.status(404)
        expect(res.body.error).not.to.be.empty
       })

    it('should import the song matching the given id')
  })
})
