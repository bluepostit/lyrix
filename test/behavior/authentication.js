const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const app = require('../../app')
const { User } = require('../../models')
const RecordManager = require('../record-manager')
const SessionManager = require('../session-manager')
const { getDebugger } = require('../common')
const debug = getDebugger()

const BASE_URL = '/api/user'

describe(BASE_URL, () => {
  const cleanUp = async () => {
    await RecordManager.deleteAll()
  }
  beforeEach(async () => cleanUp())
  after(async () => cleanUp())

  describe('POST /login', () => {
    it('should return an error if no email is given', async () => {
      const user = await RecordManager.insertUser()
      const res = await chai
        .request(app)
        .post(`${BASE_URL}/login`)
        .send({ password: user.unencryptedPassword })

      const body = res.body
      debug(body)
      expect(body).to.have.status(401) // Unauthorized
      expect(body.error).to.match(/email/)
    })

    it('should return an error if no password is given', async () => {
      const user = await RecordManager.insertUser()
      const res = await chai
        .request(app)
        .post(`${BASE_URL}/login`)
        .send({ email: user.email })

      const body = res.body
      debug(body)
      expect(body).to.have.status(401) // Unauthorized
      expect(body.error).to.match(/email/)
    })

    it('should return an error if an incorrect password is given',
      async () => {
        const user = await RecordManager.insertUser()
        const res = await chai
          .request(app)
          .post(`${BASE_URL}/login`)
          .send({
            email: user.email,
            password: `${user.unencryptedPassword}@`
          })

        const body = res.body
        debug(body)
        expect(body).to.have.status(401) // Unauthorized
        expect(body.error).to.match(/email/)
      })

    it('should return an error if no user matches given credentials',
      async () => {
        const res = await chai
          .request(app)
          .post(`${BASE_URL}/login`)
          .send({
            email: 'test.email@host.com',
            password: '123456'
          })

        const body = res.body
        debug(body)
        expect(body).to.have.status(401) // Unauthorized
        expect(body.error).to.match(/email/)
      })
  })

  describe('POST /sign-up', () => {

  })
})
