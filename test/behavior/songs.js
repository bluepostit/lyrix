const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
const app = require('../../app')

const Artist = require('../../models/artist')
const Song = require('../../models/song')

chai.use(chaiHttp)

const insertTwoSongsWithArtists = async () => {
  await Song
    .query()
    .insertGraph([
      {
        title: 'Song 1',
        text: 'This is Song 1',

        artist: {
          name: 'Bobby'
        }
      }, {
        title: 'Song 2',
        text: 'This is Song 2',

        artist: {
          name: 'Sue'
        }
      }
    ])
}

describe('/songs', () => {
  beforeEach(async () => {
    await Song.query().delete()
    await Artist.query().delete()
  })

  describe('GET /songs', () => {
    it('should return a list of all songs in the database', async () => {
      try {
        await insertTwoSongsWithArtists()
      } catch (error) {
        console.log(error)
      }

      chai.request(app)
        .get('/songs')
        .end((err, res) => {
          if (err) {
            console.log(err)
          }
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          const data = res.body.data
          const data0 = data[0]
          expect(data.length).to.eql(2)
          expect(data0.title).to.eql('Song 1')
          expect(data0.artist).to.be.an('object')
          expect(data0.artist.name).to.be.eql('Bobby')
          expect(data[1].text).to.eql('This is Song 2')
        })
    })

    it('should return empty when there are no songs', async () => {
      chai.request(app)
        .get('/songs')
        .end((err, res) => {
          if (err) {
            console.log(err)
          }
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          expect(res.body.data.length).to.eql(0)
        })
    })
  })

  describe('GET /songs/:id', () => {
    it('should return an error when no matching song can be found', async () => {
      chai.request(app)
        .get('/songs/23')
        .end((err, res) => {
          if (err) {
            console.log(err)
          }
          expect(res.body).to.have.status(404)
          expect(res.body).to.be.an('object')
          expect(res.body).to.haveOwnProperty('error')
        })
    })

    it('should return the song with the given id when found', async () => {
      const songTitle = 'A good song'
      const songText = 'This is a good song'

      let song = await Song
        .query()
        .insertGraph({
          title: songTitle,
          text: songText,

          artist: {
            name: 'Brian'
          }
        })

      chai.request(app)
        .get(`/songs/${song.id}`)
        .end((err, res) => {
          if (err) {
            console.log(err)
          }
          expect(res.body).to.have.status(200)
          const data = res.body.data
          expect(data).to.be.an('object')
          expect(data.title).to.eql(songTitle)
          expect(data.text).to.eql(songText)
        })
    })
  })

  describe('GET /songs/count', () => {
    const expectSongCount = (count) => {
      chai.request(app)
        .get('/songs/count')
        .end((err, res) => {
          if (err) {
            console.log(err)
          }
          expect(res.body).to.have.status(200)
          expect(res.body.data).to.eql(0)
        })
    }
    it('should return zero when there are no songs in the database', async () => {
      expectSongCount(0)
    })

    it('should return the correct count of songs in the database', async () => {
      try {
        await insertTwoSongsWithArtists()
      } catch (err) {
        console.log(err)
      }
      expectSongCount(2)
    })
  })
})
