const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
const app = require('../../app')
const { User } = require('../../models')
const RecordManager = require('../record-manager')

chai.use(chaiHttp)

describe('/user', () => {
  beforeEach(async () => {
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
    it('should return an error message if there are empty fields', async () => {
      await User.createUser(TEST_USER_DATA)
      try {
        chai.request(app)
          .post('/user/login')
          .send({
            username: TEST_USER_DATA.email,
            password: ''
          })
          .end((err, res) => {
            if (err) {
              console.log(err.stack)
            }
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('object')

            const data = res.body
            expect(data.status).to.eql(401)
            expect(data.error).to.eql('not found')
          })
      } catch (err) {
        console.log(err)
      }
    })

    it('should return an error message if there is no matching user',
      async () => {
        try {
          chai.request(app)
            .post('/user/login')
            .send({
              username: TEST_USER_DATA.email,
              password: ''
            })
            .end((err, res) => {
              if (err) {
                console.log(err.stack)
              }
              expect(res).to.have.status(200)
              expect(res.body).to.be.an('object')

              const data = res.body
              expect(data.status).to.eql(401)
              expect(data.error).to.eql('not found')
            })
        } catch (err) {
          console.log(err)
        }
      })

    it('should return a success message when given correct credentials',
      async () => {
        await User.createUser(TEST_USER_DATA)
        try {
          const res = await chai.request(app)
            .post('/user/login')
            .send({
              username: TEST_USER_DATA.email,
              password: TEST_USER_DATA.password
            })
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')

          const data = res.body
          expect(data.status).to.eql(200)
          expect(data.user).to.be.an('object')
          expect(data.user.email).to.eql(TEST_USER_DATA.email)
        } catch (err) {
          console.log(err)
        }
      })

    it('should return the user\'s songlists when given correct credentials',
      async () => {
        const bob = await User.createUser(TEST_USER_DATA)
        await bob
          .$relatedQuery('songLists')
          .insertGraph([
            {
              title: 'SongList 1'
            },
            {
              title: 'SongList 2'
            }
          ])
        try {
          const res = await chai.request(app)
            .post('/user/login')
            .send({
              username: TEST_USER_DATA.email,
              password: TEST_USER_DATA.password
            })
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')

          const data = res.body
          expect(data.status).to.eql(200)
          expect(data.user).to.be.an('object')
          expect(data.user.email).to.eql(TEST_USER_DATA.email)
          expect(data.user).to.have.property('songLists')
          expect(data.user.songLists.length).to.eql(2)
          expect(data.user.songLists[1]).to.include({ title: 'SongList 2' })
        } catch (err) {
          console.log(err)
        }
      })
  })

  describe('POST /sign-up', () => {
    it('should fail if a user is already signed in', async () => {
      await User.createUser(LOGGED_IN_USER_DATA)

      try {
        // Login with chai agent
        const agent = chai.request.agent(app)

        await agent
          .post('/user/login')
          .send({
            username: LOGGED_IN_USER_DATA.email,
            password: LOGGED_IN_USER_DATA.password
          })
        const res = await agent
          .post('/user/sign-up')
          .send(GOOD_SIGN_UP_DATA)

        expect(res.body).to.have.status(403) // forbidden
      } catch (e) {
        console.log(e)
      }
    })

    it('should allow a user to sign up with valid input', async () => {

    })

    it('should fail with empty input', async () => {

    })

    it('should fail with duplicated email address', async () => {

    })

    it('should fail with non-email email address', async () => {

    })

    it('should fail with password that is too short', async () => {

    })
  })
})
