const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
const app = require('../../app')

const { User } =
  require('../../models')
const RecordManager = require('../record-manager.js')

const TEST_USER_DATA = {
  email: 'bob-songlist@bob.bob',
  password: 'safe-and-secure'
}

const TEST_SONGLIST_DATA = [
  {
    title: 'SongList 1'
  },
  {
    title: 'SongList 2'
  }
]

const TEST_SONGLIST_AND_SONG_DATA = [
  {
    title: 'SongList 1',
    songs: [
      {
        title: 'List1 > Song1',
        text: 'List1 > Song1',

        artist: {
          name: 'Artist 1'
        }
      },
      {
        title: 'List1 > Song2',
        text: 'List1 > Song2',

        artist: {
          name: 'Artist 2'
        }
      }
    ]
  },
  {
    title: 'SongList 2',
    songs: [
      {
        title: 'List2 > Song1',
        text: 'List2> Song1',
        artist: {
          name: 'Artist 3'
        }
      },
      {
        title: 'List2 > Song2',
        text: 'List2> Song2',
        artist: {
          name: 'Artist 4'
        }
      }
    ]
  }
]

chai.use(chaiHttp)

const insertUser = async () => {
  const user = await User.createUser(TEST_USER_DATA)
  return user
}

const insertUserWithTwoSonglists = async () => {
  const bob = await insertUser()
  return bob
    .$relatedQuery('songLists')
    .insertGraph(TEST_SONGLIST_DATA)
}

const insertUserWithTwoFullSonglists = async () => {
  const bob = await insertUser()
  return bob
    .$relatedQuery('songLists')
    .insertGraph(TEST_SONGLIST_AND_SONG_DATA)
}

describe('/songlists', () => {
  beforeEach(async () => {
    await RecordManager.deleteAll()
  })
  after(async () => {
    await RecordManager.deleteAll()
  })

  describe('GET /songlists', () => {
    it('should return an error when not logged in', async () => {
      await insertUserWithTwoSonglists()
      const res = await chai.request(app)
        .get('/songlists')

      expect(res).to.have.status(200)
      expect(res.body).to.have.status(401)
      expect(res.body.error).to.not.be.empty
    })

    it('should return a list of the current user\'s songlists', async () => {
      await insertUserWithTwoSonglists()

      // Login with chai agent
      const agent = chai.request.agent(app)

      await agent
        .post('/user/login')
        .send({
          username: TEST_USER_DATA.email,
          password: TEST_USER_DATA.password
        })

      const res = await agent
        .get('/songlists')
      agent.close()

      expect(res).to.have.status(200)
      expect(res.body).to.be.an('object')
      expect(res.body.error).to.eql(false)

      const songLists = res.body.data
      expect(songLists).to.be.an('array')
      expect(songLists.length).to.eql(2)
      expect(songLists[1].title).to.eql(TEST_SONGLIST_DATA[1].title)
    })
  })

  describe('GET /songlists/:id', () => {
    it('should return an error when no matching songlist can be found',
      async () => {
        await insertUserWithTwoFullSonglists()
        // Login with chai agent
        const agent = chai.request.agent(app)

        await agent
          .post('/user/login')
          .send({
            username: TEST_USER_DATA.email,
            password: TEST_USER_DATA.password
          })

        agent.get('/songlists/999999999')
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
      const lists = await insertUserWithTwoFullSonglists()
      // Login with chai agent
      const agent = chai.request.agent(app)

      await agent
        .post('/user/login')
        .send({
          username: TEST_USER_DATA.email,
          password: TEST_USER_DATA.password
        })

      agent.get(`/songlists/${lists[0].id}`)
        .end((err, res) => {
          if (err) {
            console.log(err)
          }
          expect(res.body).to.have.status(200)
          const data = res.body.data
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

  describe('POST /songlists', () => {
    it('should return an error when not signed in', async () => {
      chai.request(app).post('/songlists')
        .send({ name: 'test songlist' })
        .end((err, res) => {
          if (err) {
            console.log(err)
          }
          expect(res.body).to.have.status(401)
        })
    })

    it('should return an error when a songlist with this name already exists',
      async () => {
        const lists = await insertUserWithTwoFullSonglists()
        console.log(lists)

        // Login with chai agent
        const agent = chai.request.agent(app)

        await agent
          .post('/user/login')
          .send({
            username: TEST_USER_DATA.email,
            password: TEST_USER_DATA.password
          })

        agent.post('/songlists')
          .send({ title: lists[0].title })
          .end((err, res) => {
            if (err) {
              console.log(err)
            }
            expect(res.body).to.have.status(400)
          })
      })
  })
})
