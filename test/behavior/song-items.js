const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const app = require('../../app')
const { SongItem } = require('../../models')
const RecordManager = require('../record-manager')
const SessionManager = require('../session-manager')

describe('/song-items', async () => {
  const cleanUp = async () => {
    await RecordManager.deleteAll()
  }

  beforeEach(async () => cleanUp())
  after(async () => cleanUp())

  /**
   * Logs in with RecordManager's default user.
   * @param user OPTIONAL a User entity to use for logging in.
   * Must have property `unencryptedPassword` set, or login will fail.
   *
   * @returns ChaiAgent the agent to use for subsequent requests
   */
  const login = async (user) => {
    user = user || await RecordManager.insertUser()
    const agent = chai.request.agent(app)
    await SessionManager.loginAsUser(agent, user)
    return agent
  }

  describe('GET /', () => {

    it('should return an error when not logged in', async () => {
      const res = await chai.request(app).get('/song-items')

      expect(res).to.have.status(200)
      expect(res.body).to.have.status(401)
      expect(res.body.error).to.not.be.empty
    })

    it('should return empty when the user has no song items', async () => {
      const agent = await login()
      const res = await agent.get('/song-items')
      agent.close()

      expect(res).to.have.status(200)
      expect(res.body).to.be.an('object')
      expect(res.body.error).to.be.eql(false)
      expect(res.body.data).to.be.empty
    })

    it('should not return song items belonging to other users', async () => {
      await RecordManager.loadFixture('song-items.only-other-user')

      const allItemsCount = await SongItem.query().resultSize()
      expect(allItemsCount).to.be.greaterThan(0)

      const agent = await login()
      const res = await agent.get('/song-items')
      agent.close()

      expect(res).to.have.status(200)
      expect(res.body).to.be.an('object')
      expect(res.body.data).to.be.empty
    })

    it('should return song items belonging to the current user, ordered by song title', async () => {
      const user = await RecordManager.insertUser({ id: 1 })
      await RecordManager.loadFixture('song-items.with-song-item-types.user-id-1')
      const items = await SongItem
        .query()
        .joinRelated('song')
        .orderBy('song.title')

      const agent = await login(user)
      const res = await agent.get('/song-items')
      agent.close()

      expect(res).to.have.status(200)
      expect(res.body).to.be.an('object')
      const data = res.body.data
      expect(data.length).to.be.eql(items.length)
      data.forEach((o, index) => {
        expect(items[index].title).to.eql(o.title)
        expect(items[index].song_id).to.eql(o.song_id)
      })
    })
  })
})
