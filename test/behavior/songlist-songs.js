const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const app = require('../../app')

const { SongListSong } = require('../../models')
const RecordManager = require('../record-manager.js')
const SessionManager = require('../session-manager')

const BASE_URL = '/api/songlist-songs'

describe(BASE_URL, async () => {
  beforeEach(async () => {
    await RecordManager.deleteAll()
  })
  after(async () => {
    await RecordManager.deleteAll()
  })

  const getFirstSonglistSong = async () => {
    const songlist = await SongListSong
      .query()
      .first()
      .withGraphFetched('[songList,song]')
    return songlist
  }

  describe('DELETE /:id', () => {
    it('should return an error if the user is not signed in', async () => {
      await RecordManager.insertUser({ id: 1 })
      await RecordManager.loadFixture('songlists.with-user-id-1')
      const songlistSong = await getFirstSonglistSong()

      const res = await chai.request(app)
        .delete(`${BASE_URL}/${songlistSong.id}`)
      const body = res.body
      expect(body).to.have.status(401)
      expect(body.error).not.to.be.empty
    })

    it('should return an error if the songlist song doesn\'t exist',
      async () => {
        const user = await RecordManager.insertUser()
        const agent = await SessionManager.loginAsUser(app, user)

        const res = await agent
          .delete(`${BASE_URL}/1`)
        const body = res.body
        expect(body).to.have.status(404)
        expect(body.error).not.to.be.empty
      })

    it('should return an error if the songlist belongs to another user',
      async () => {
        await RecordManager.loadFixture('songlists.only-other-user')
        const songlistSong = await getFirstSonglistSong()
        const user = await RecordManager.insertUser()
        const agent = await SessionManager.loginAsUser(app, user)

        const res = await agent
          .delete(`${BASE_URL}/${songlistSong.id}`)
        const body = res.body
        expect(body).to.have.status(403)
        expect(body.error).not.to.be.empty
      })

    it('should delete the songlist song successfully', async () => {
      const user = await RecordManager.insertUser({ id: 1 })
      await RecordManager.loadFixture('songlists.with-user-id-1')
      const songlistSongs = await SongListSong.query()
      const lengthBefore = songlistSongs.length

      const agent = await SessionManager.loginAsUser(app, user)
      const res = await agent
        .delete(`${BASE_URL}/${songlistSongs[0].id}`)
      const body = res.body
      expect(body).to.have.status(204)

      const lengthAfter = await SongListSong
        .query()
        .resultSize()
      expect(lengthAfter).to.eql(lengthBefore - 1)
    })
  })
})
