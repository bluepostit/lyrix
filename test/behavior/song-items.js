const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const app = require('../../app')
const RecordManager = require('../record-manager')
const SessionManager = require('../session-manager')

describe('/song-items', async () => {
  const cleanUp = async () => {
    await RecordManager.deleteAll()
  }

  beforeEach(async () => cleanUp())
  after(async () => cleanUp())

  it('should return an error when not logged in', async () => {
    const res = await chai.request(app)
      .get('/song-items')

    expect(res).to.have.status(200)
    expect(res.body).to.have.status(401)
    expect(res.body.error).to.not.be.empty
  })

  it('should return empty when the user has no song items', async () => {
    const user = await RecordManager.insertUser()

    const agent = chai.request.agent(app)
    await SessionManager.loginAsUser(agent,
      user.email, user.unencryptedPassword)
    const res = await agent
      .get('/song-items')
    agent.close()

    expect(res).to.have.status(200)
    expect(res.body).to.be.an('object')
    expect(res.body.error).to.be.eql(false)
    expect(res.body.data).to.be.empty
  })
})
