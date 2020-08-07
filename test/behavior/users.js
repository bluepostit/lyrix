const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
const app = require('../../app')
const { User } = require('../../models')
const RecordManager = require('../record-manager')
const { getDebugger } = require('../common')
const debug = getDebugger()

chai.use(chaiHttp)

const BASE_URL = '/api/user'

describe(BASE_URL, () => {
  beforeEach(async () => {
    await RecordManager.deleteAll()
  })
  after(async () => {
    await RecordManager.deleteAll()
  })

  const LOGGED_IN_USER_DATA = {
    email: 'bob-user@bob.bob',
    password: 'safe-and-secure'
  }

  const TEST_USER_DATA = {
    email: 'bob@bob.bob',
    password: 'safe-and-secure'
  }

  const GOOD_SIGN_UP_DATA = {
    email: 'bob-sign-up@bob.bob',
    password: 'safe-and-secure',
    password2: 'safe-and-secure'
  }

  describe('POST /login', () => {
    it('should return an error when no email is given', async () => {
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

    it('should return an error when no password is given', async () => {
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

    it('should return a success message when given correct credentials',
      async () => {
        const user = await RecordManager.insertUser()
        const res = await chai
          .request(app)
          .post(`${BASE_URL}/login`)
          .send({
            username: user.email,
            password: user.unencryptedPassword
          })

          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')

          const body = res.body
          debug(body)
          expect(body.status).to.eql(200)
          expect(body.user).to.be.an('object')
          expect(body.user.email).to.eql(user.email)
      })
  })

  describe('POST /sign-up', () => {
    it('should fail if a user is already signed in', async () => {
      const user = await RecordManager.insertUser()
      const agent = chai.request.agent(app)
      await agent
        .post(`${BASE_URL}/login`)
        .send({
          username: user.email,
          password: user.unencryptedPassword
        })

      // Now try to sign up as a different user
      const res = await agent
        .post(`${BASE_URL}/sign-up`)
        .send(GOOD_SIGN_UP_DATA)

      expect(res.body).to.have.status(403) // forbidden
    })

    it('should allow a user to sign up with valid input', async () => {

    })

    it('should fail with empty or missing input', async () => {
      try {
        const agent = chai.request.agent(app)

        // Empty password
        let res = await agent
          .post(`${BASE_URL}/sign-up`)
          .send({
            email: GOOD_SIGN_UP_DATA.email,
            password: '',
            password2: ''
          })
        expect(res.body).to.have.status(400) // bad request
        // Empty email
        res = await agent
          .post(`${BASE_URL}/sign-up`)
          .send({
            email: '',
            password: GOOD_SIGN_UP_DATA.password,
            password2: GOOD_SIGN_UP_DATA.password2
          })
        expect(res.body).to.have.status(400) // bad request
        // Missing password2
        res = await agent
          .post(`${BASE_URL}/sign-up`)
          .send({
            email: GOOD_SIGN_UP_DATA.email,
            password: ''
          })
        expect(res.body).to.have.status(400) // bad request
      } catch (e) {
        console.log(e)
      }
    })

    it('should fail with duplicated email address', async () => {
      const user = await RecordManager.insertUser()
      const agent = chai.request.agent(app)

      const res = await agent
        .post(`${BASE_URL}/sign-up`)
        .send({
          email: user.email,
          password: user.unencryptedPassword,
          password2: user.unencryptedPassword
        })

      expect(res.body).to.have.status(400) // forbidden
      expect(res.body.error).to.include('already exists')
    })

    it('should fail with non-email email address', async () => {
      const agent = chai.request.agent(app)

      // Empty password
      const res = await agent
        .post(`${BASE_URL}/sign-up`)
        .send({
          email: 'not-an-email.address',
          password: GOOD_SIGN_UP_DATA.password,
          password2: GOOD_SIGN_UP_DATA.password2
        })
      expect(res.body).to.have.status(400) // bad request
      expect(res.body.error).to.match(/email/)
    })

    it('should fail with password that is too short', async () => {
      try {
        const agent = chai.request.agent(app)

        // Empty password
        const res = await agent
          .post(`${BASE_URL}/sign-up`)
          .send({
            email: GOOD_SIGN_UP_DATA.email,
            password: '123',
            password2: '123'
          })
        expect(res.body).to.have.status(400) // bad request
      } catch (e) {
        console.log(e)
      }
    })

    it('should fail with passwords that don\'t match', async () => {
      try {
        const agent = chai.request.agent(app)

        // Empty password
        const res = await agent
          .post(`${BASE_URL}/sign-up`)
          .send({
            email: GOOD_SIGN_UP_DATA.email,
            password: GOOD_SIGN_UP_DATA.password,
            password2: GOOD_SIGN_UP_DATA.password + 'x'
          })
        expect(res.body).to.have.status(400) // bad request
      } catch (e) {
        console.log(e)
      }
    })
  })
})
