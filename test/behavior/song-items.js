const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const app = require('../../app')
const RecordManager = require('../record-manager')

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
})
