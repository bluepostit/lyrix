const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const app = require('../../app')
const { Song, SongItem, SongItemType } = require('../../models')
const RecordManager = require('../record-manager')
const SessionManager = require('../session-manager')

describe('/song-items', async () => {
  const cleanUp = async () => {
    await RecordManager.deleteAll()
  }

  beforeEach(async () => cleanUp())
  after(async () => cleanUp())

  describe('GET /', () => {

    it('should return an error when not logged in', async () => {
      const res = await chai.request(app).get('/song-items')

      expect(res).to.have.status(200)
      expect(res.body).to.have.status(401)
      expect(res.body.error).to.not.be.empty
    })

    it('should return empty when the user has no song items', async () => {
      const user = await RecordManager.insertUser()
      const agent = await SessionManager.loginAsUser(app, user)
      const res = await agent.get('/song-items')
      agent.close()

      expect(res).to.have.status(200)
      expect(res.body).to.be.an('object')
      expect(res.body).not.to.haveOwnProperty('error')
      expect(res.body.data).to.be.empty
    })

    it('should not return song items belonging to other users', async () => {
      await RecordManager.loadFixture('song-items.only-other-user')

      const allItemsCount = await SongItem.query().resultSize()
      expect(allItemsCount).to.be.greaterThan(0)

      const user = await RecordManager.insertUser()
      const agent = await SessionManager.loginAsUser(app, user)
      const res = await agent.get('/song-items')
      agent.close()

      expect(res).to.have.status(200)
      expect(res.body).to.be.an('object')
      expect(res.body.data).to.be.empty
    })

    it('should return song items belonging to the current user, ordered by song title', async () => {
      const user = await RecordManager.insertUser({ id: 1 })
      await RecordManager.loadFixture('song-items.with-song-item-types.user-id-1')
      const items = await SongItem
        .query()
        .joinRelated('song')
        .orderBy(['song.title', 'title'])

      const agent = await SessionManager.loginAsUser(app, user)
      const res = await agent.get('/song-items')
      agent.close()

      expect(res).to.have.status(200)
      expect(res.body).to.be.an('object')
      const data = res.body.data
      expect(data.length).to.be.eql(items.length)
      data.forEach((o, index) => {
        expect(items[index].title).to.eql(o.title)
        expect(items[index].song_id).to.eql(o.song_id)
      })
    })
  })

  describe('GET /:id', () => {
    it('should return an error when not logged in', async () => {
      const res = await chai.request(app).get('/song-items/2')

      expect(res).to.have.status(200)
      expect(res.body).to.have.status(401)
      expect(res.body.error).to.not.be.empty
    })

    it('should return an error if the song item belongs to another user', async () => {
      await RecordManager.loadFixture('song-items.only-other-user')
      const item = await SongItem.query().first()

      const user = await RecordManager.insertUser()
      const agent = await SessionManager.loginAsUser(app, user)
      const res = await agent.get(`/song-items/${item.id}`)
      agent.close()

      expect(res).to.have.status(200)
      expect(res.body).to.be.an('object')
      expect(res.body).to.have.status(403)
      expect(res.body.error).to.not.be.empty
      expect(res.body.data).to.be.undefined
    })

    it('should return an error when no matching song item can be found', async () => {
      const user = await RecordManager.insertUser()
      const agent = await SessionManager.loginAsUser(app, user)
      const res = await agent.get('/song-items/23')
      expect(res.body).to.have.status(404)
      expect(res.body).to.be.an('object')
      expect(res.body).to.haveOwnProperty('error')
    })

    it('should return the song item with the given id when found', async () => {
      const user = await RecordManager.insertUser({ id: 1 })
      await RecordManager.loadFixture('song-items.with-song-item-types.user-id-1')
      const item = await SongItem
        .query().first().withGraphFetched('song')

      const agent = await SessionManager.loginAsUser(app, user)
      const res = await agent.get(`/song-items/${item.id}`)
      agent.close()

      expect(res.body).to.have.status(200)
      const data = res.body.data
      expect(data).to.be.an('object')
      expect(data.title).to.eql(item.title)
      expect(data.text).to.eql(item.text)
      expect(data.song.title).to.eql(item.song.title)
    })
  })

  describe('POST /', () => {
    it('should return an error when not signed in', async () => {
      chai.request(app).post('/song-items')
        .send({ title: 'test' })
        .end((err, res) => {
          if (err) {
            console.log(err)
          }
          expect(res.body).to.have.status(401)
        })
    })

    it('should return an error when no title is given',
      async () => {
        const user = await RecordManager.insertUser()
        await RecordManager.loadFixture('songs.with-song-item-types')
        const song = await Song.query().first()
        const songItemType = await SongItemType.query().first()

        const agent = await SessionManager.loginAsUser(app, user)
        const data = {
          text: 'This is the text we want',
          song_id: song.id,
          song_item_type_id: songItemType.id
        }

        const res = await agent
          .post('/song-items')
          .send(data)
        expect(res.body).to.have.status(400)
        expect(res.body.error).to.not.be.empty
      })

    it('should return an error when a song item with this name and song already exists',
      async () => {
        const user = await RecordManager.insertUser({ id: 1 })
        await RecordManager.loadFixture('song-items.with-song-item-types.user-id-1')
        const item = await SongItem.query().first()

        const agent = await SessionManager.loginAsUser(app, user)
        const data = {
          title: item.title,
          text: item.text + ' la la la',
          song_id: item.song_id,
          song_item_type_id: item.song_item_type_id
        }
        const res = await agent
          .post('/song-items')
          .send(data)
        expect(res.body).to.have.status(400)
      })

    it('should create a new song item when given valid data', async () => {
      const user = await RecordManager.insertUser()
      await RecordManager.loadFixture('songs.with-song-item-types')
      const song = await Song.query().first()
      const songItemType = await SongItemType.query().first()

      const agent = await SessionManager.loginAsUser(app, user)
      const data = {
        title: 'A new song item',
        text: 'This is the text we want',
        song_id: song.id,
        song_item_type_id: songItemType.id
      }

      const res = await agent.post('/song-items').send(data)

      const body = res.body
      expect(body).to.have.status(201) // Created
      expect(body.id).to.match(/^\d+/)
      agent.close()
    })
  })

  describe('PUT /:id', () => {
    it('should return an error when not signed in', async () => {
      chai.request(app).put('/song-items/1')
        .send({ title: 'test' })
        .end((err, res) => {
          if (err) {
            console.log(err)
          }
          expect(res.body).to.have.status(401)
        })
    })

    it('should return an error when no id is given', async () => {
      const user = await RecordManager.insertUser()
      const agent = await SessionManager.loginAsUser(app, user)
      const res = await agent.put('/song-items')

      const body = res.body
      expect(body).to.have.status(400)
      expect(body.error).to.not.be.empty
    })

    it('should return an error when no song item can be found with the given id',
      async () => {
        const user = await RecordManager.insertUser()
        const agent = await SessionManager.loginAsUser(app, user)
        const res = await agent
          .put('/song-items/1')
          .send({})

        const body = res.body
        expect(body).to.have.status(404)
      })

    it("should return an error when the song item doesn't belong to the user",
      async () => {
        await RecordManager.loadFixture('song-items.only-other-user')
        const user = await RecordManager.insertUser({ id: 1 })

        const agent = await SessionManager.loginAsUser(app, user)
        const item = await SongItem.query().first()

        const res = await agent.put(`/song-items/${item.id}`)
        agent.close()

        const body = res.body
        expect(body).to.have.status(403)
      })


    it('should return an error when text is too short', async () => {
      const user = await RecordManager.insertUser({ id: 1 })
      await RecordManager.loadFixture(
        'song-items.with-song-item-types.user-id-1')
      const songItem = await SongItem.query().first()

      const agent = await SessionManager.loginAsUser(app, user)
      const data = {
        title: songItem.title,
        text: 'a',
        song_id: songItem.song_id,
        song_item_type_id: songItem.song_item_type_id
      }

      const res = await agent
        .put(`/song-items/${songItem.id}`)
        .send(data)
      const body = res.body
      expect(body).to.have.status(400)
      expect(body.error).to.not.be.empty
      expect(body.message).to.match(/text.*short/i)
    })

    it('should update the song item with the given data', async () => {
      const user = await RecordManager.insertUser({ id: 1 })
      await RecordManager.loadFixture(
        'song-items.with-song-item-types.user-id-1')
      const songItems = await SongItem.query()
      const songItem = songItems[0]

      const agent = await SessionManager.loginAsUser(app, user)
      const data = {
        title: songItem.title + ' v2',
        text: songItem.text,
        song_id: songItem.song_id,
        abc: 'asdf',
        song_item_type_id: songItem.song_item_type_id
      }

      const res = await agent
        .put(`/song-items/${songItem.id}`)
        .send(data)
      const body = res.body

      expect(body).to.have.status(200)
      expect(body.data).to.be.an('object')
      expect(body.data.title).to.eql(data.title)

      const countAfter = await SongItem.query().resultSize()
      expect(countAfter).to.eql(songItems.length)
    })
  })

  describe('DELETE /song-items/:id', () => {
    it('should return an error when not signed in', async () => {
      chai.request(app).delete('/song-items/1')
        .end((err, res) => {
          if (err) {
            console.log(err)
          }
          expect(res.body).to.have.status(401)
        })
    })

    it('should return an error when no id is given', async () => {
      const user = await RecordManager.insertUser()
      const agent = await SessionManager.loginAsUser(app, user)
      const res = await agent.delete('/song-items')

      const body = res.body
      expect(body).to.have.status(400)
      expect(body.error).to.not.be.empty
    })

    it('should return an error when no song item can be found with the given id',
      async () => {
        const user = await RecordManager.insertUser()
        const agent = await SessionManager.loginAsUser(app, user)
        const res = await agent
          .delete('/song-items/1')

        const body = res.body
        expect(body).to.have.status(404)
      })

    it("should return an error when the song item doesn't belong to the user",
      async () => {
        await RecordManager.loadFixture('song-items.only-other-user')
        const user = await RecordManager.insertUser({ id: 1 })

        const agent = await SessionManager.loginAsUser(app, user)
        const item = await SongItem.query().first()

        const res = await agent.delete(`/song-items/${item.id}`)
        agent.close()

        const body = res.body
        expect(body).to.have.status(403)
      })

    it('should delete the song item with the given id', async () => {
      const user = await RecordManager.insertUser({ id: 1 })
      await RecordManager.loadFixture(
        'song-items.with-song-item-types.user-id-1')
      const songItems = await SongItem.query()
      const songItem = songItems[0]

      const agent = await SessionManager.loginAsUser(app, user)
      const res = await agent
        .delete(`/song-items/${songItem.id}`)
      const body = res.body

      expect(body).to.have.status(204) // no content

      const countAfter = await SongItem.query().resultSize()
      expect(countAfter).to.eql(songItems.length - 1)
    })
  })

  describe('User Actions', () => {
    it('should provide a user with a link to edit or delete her song item',
      async () => {
        const user = await RecordManager.insertUser({ id: 1 })
        await RecordManager.loadFixture(
          'song-items.with-song-item-types.user-id-1')
        const songItem = await SongItem.query().first()
        const agent = await SessionManager.loginAsUser(app, user)

        const res = await agent.get(`/song-items/${songItem.id}`)
        const body = res.body
        expect(body.actions).to.be.an('object')
        expect(body.actions).to.have.property('edit')
        expect(body.actions).to.have.property('delete')
      })
  })
})
