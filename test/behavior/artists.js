const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
const app = require('../../app')
const db = require('../../models')

chai.use(chaiHttp)

describe('artists', () => {
  beforeEach((done) => {
    db.Song.destroy({ where: {}, force: true })
    .then(() => db.Artist.destroy({ where: {}, force: true }))
    .then(() => done())
  })
  
  describe('GET /artists', () => {
    it('should return a list of all artists in the database', done => {
      db.Artist.bulkCreate([
        {
          name: 'Bobby'
        }, {
          name: 'Sue'
        }
      ]).done(() => {
        chai.request(app)
        .get('/artists')
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          let data = res.body.data
          expect(data).to.be.an('array')
          expect(data.length).to.eql(2)
          let artist0 = data[0]
          expect(artist0).to.be.an('object')
          expect(artist0.name).to.eql('Bobby')
          let artist1 = data[1]
          expect(artist1.name).to.eql('Sue')
          done()
        })
      })
    })
    
    it('should return empty when there are no artists', done => {
      chai.request(app)
      .get('/artists')
      .end((err, res) => {
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('object')
        expect(res.body.data.length).to.eql(0)
        done()
      })
    })
  })
  
  describe('GET /artists/:id', () => {
    it('should return an error when no matching artist can be found', done => {
      chai.request(app)
      .get('/artists/23')
      .end((err, res) => {
        expect(res.body).to.have.status(404)
        expect(res.body).to.be.an('object')
        expect(res.body).to.haveOwnProperty('error')
        done()
      })
    })
    
    it('should return the artist with the given id when found', done => {
      db.Artist.create({ name: 'Brian' })
      .then(artist => {
        chai.request(app)
        .get(`/artists/${artist.id}`)
        .end((err, res) => {
          expect(res.body).to.have.status(200)
          expect(res.body.data).to.be.an('object')
          expect(res.body.data.name).to.eql('Brian')
          done()
        })
      })
    })
    
    it('should also return the artist\'s songs', done => {
      let pete = null;
      db.Artist.create({ name: 'Skinny Pete' })
      .then(artist => {
        pete = artist;
        return db.Song.bulkCreate([
          {
            title: 'A Blue Song',
            text: 'This song is blue',
            ArtistId: artist.id
          }, {
            title: 'A Green Song',
            text: 'This song is green',
            ArtistId: artist.id
          }
        ])
      }).then(songs => {
        chai.request(app)
        .get(`/artists/${pete.id}`)
        .end((err, res) => {
          expect(res.body).to.have.status(200)
          let artist = res.body.data;
          expect(artist).to.be.an('object')
          expect(artist.name).to.eql('Skinny Pete')
          expect(artist.songs).to.be.an('array')
          expect(artist.songs.length).to.eql(2)
          done()
        })
      })
    })
  })
})