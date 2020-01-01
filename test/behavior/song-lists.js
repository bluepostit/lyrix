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
    title: 'SongList 1',
    songs: [
      {
        title: '1st Song',
        text: 'This is the 1st Song',

        artist: {
          name: '1st Artist'
        }
      },
      {
        title: '2nd Song',
        text: 'This is the 2nd Song',

        artist: {
          name: '2nd Artist'
        }
      }
    ]
  },
  {
    title: 'SongList 2'
  }
]

chai.use(chaiHttp)

const insertUserWithTwoSonglists = async () => {
  const bob = await User.createUser(TEST_USER_DATA)
  return bob
    .$relatedQuery('songLists')
    .insertGraph(TEST_SONGLIST_DATA)
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
})
