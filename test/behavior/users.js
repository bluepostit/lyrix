const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
const app = require('../../app')
const { SongList, User } = require('../../models')

chai.use(chaiHttp)

describe('/user', () => {
  beforeEach(async () => {
    await SongList.query().delete()
    await User.query().delete()
  })

  const TEST_USER_DATA = {
    email: 'bob@bob.bob',
    password: 'safe-and-secure'
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
})
