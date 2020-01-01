const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
const app = require('../../app')

const { Artist, Song, SongList, SongListSong, User } =
  require('../../models')

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

const insertUserWithTwoSonglists = async () => {
  const bob = await User.createUser(TEST_USER_DATA)
  return bob
    .$relatedQuery('songLists')
    .insertGraph(TEST_SONGLIST_DATA)
}

const insertUserWithTwoFullSonglists = async () => {
  const bob = await User.createUser(TEST_USER_DATA)
  return bob
    .$relatedQuery('songLists')
    .insertGraph(TEST_SONGLIST_AND_SONG_DATA)
}

describe('/songlists', () => {
  beforeEach(async () => {
    await SongListSong.query().delete()
    await SongList.query().delete()
    await User.query().where({
      email: TEST_USER_DATA.email
    }).delete()
    await Song.query().delete()
    await Artist.query().delete()
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
          })
      })
  })
})
