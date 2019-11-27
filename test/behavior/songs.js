const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
const app = require('../../app')

const Artist = require('../../models/artist')
const Song = require('../../models/song')

chai.use(chaiHttp)

describe('songs', () => {
  beforeEach(async (done) => {
    await Song
      .query()
      .delete()

    await Artist
      .query()
      .delete()
  })

  describe('GET /songs', () => {
    // it('should return a list of all songs in the database', done => {
    //   db.Song.bulkCreate([
    //     {
    //       title: 'Song 1',
    //       text: 'This is Song 1',
    //       Artist: { name: 'Bobby' }
    //     }, {
    //       title: 'Song 2',
    //       text: 'This is Song 2',
    //       Artist: { name: 'Sue' }
    //     }
    //   ], {
    //     include: [{
    //       model: db.Artist
    //     }]
    //   }).done(() => {
    //     chai.request(app)
    //       .get('/songs')
    //       .end((err, res) => {
    //         expect(res).to.have.status(200)
    //         expect(res.body).to.be.an('object')
    //         let data = res.body.data
    //         let data0 = data[0]
    //         expect(data.length).to.eql(2)
    //         expect(data0.title).to.eql('Song 1')
    //         expect(data0.Artist).to.be.an('object')
    //         expect(data0.Artist.name).to.be.eql('Bobby')
    //         expect(data[1].text).to.eql('This is Song 2')
    //         done()
    //       })
    //     })
    // })

    it('should return empty when there are no songs', done => {
      chai.request(app)
        .get('/songs')
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          expect(res.body.data.length).to.eql(0)
          done()
        })
    })
  })

  describe('GET /songs/:id', () => {
    it('should return an error when no matching song can be found', done => {
      chai.request(app)
        .get('/songs/23')
        .end((err, res) => {
          expect(res.body).to.have.status(404)
          expect(res.body).to.be.an('object')
          expect(res.body).to.haveOwnProperty('error')
          done()
        })
    })

    // it('should return the song with the given id when found', done => {
    //   db.Artist.create({ name: 'Brian' })
    //   .then(artist => {
    //     return db.Song.create({
    //       title: 'A good song',
    //       text: 'This is a song',
    //       ArtistId: artist.id
    //     }, {
    //       include: [{ model: db.Artist }]
    //     });
    //   })
    //   .then(song => {
    //     chai.request(app)
    //     .get(`/songs/${song.id}`)
    //     .end((err, res) => {
    //       expect(res.body).to.have.status(200)
    //       expect(res.body.data).to.be.an('object')
    //       expect(res.body.data.title).to.eql('A good song')
    //       done()
    //     })
    //   })
    // })
  })
})
