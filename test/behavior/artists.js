const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
const app = require('../../app')
const Artist = require('../../models/artist')
const Song = require('../../models/song')

chai.use(chaiHttp)

describe('artists', () => {
  beforeEach(async () => {
    await Song.query().delete()
    await Artist.query().delete()
  })

  describe('GET /artists', () => {
    it('should return a list of all artists in the database', async () => {
      try {
        await Artist
          .query()
          .insert([
            {
              name: 'Bobby'
            }, {
              name: 'Sue'
            }
          ])
        chai.request(app)
          .get('/artists')
          .end((err, res) => {
            if (err) {
              console.log(err.stack)
            }
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('object')

            const data = res.body.data
            expect(data).to.be.an('array')
            expect(data.length).to.eql(2)

            const artist0 = data[0]
            expect(artist0).to.be.an('object')
            expect(artist0.name).to.eql('Bobby')

            const artist1 = data[1]
            expect(artist1.name).to.eql('Sue')
          })
      } catch (err) {
        console.log(err)
      }
    })
    
    // it('should return empty when there are no artists', () => {
    //   chai.request(app)
    //   .get('/artists')
    //   .end((err, res) => {
    //     expect(res).to.have.status(200)
    //     expect(res.body).to.be.an('object')
    //     expect(res.body.data.length).to.eql(0)
    //   })
    // })
  })

  /*
  describe('GET /artists/:id', () => {
    it('should return an error when no matching artist can be found', () => {
      chai.request(app)
      .get('/artists/23')
      .end((err, res) => {
        expect(res.body).to.have.status(404)
        expect(res.body).to.be.an('object')
        expect(res.body).to.haveOwnProperty('error')
      })
    })
    
    it('should return the artist with the given id when found', async () => {
      const artist = await Artist.query().insert({ name: 'Brian' })
      chai.request(app)
        .get(`/artists/${artist.id}`)
        .end((err, res) => {
          expect(res.body).to.have.status(200)
          expect(res.body.data).to.be.an('object')
          expect(res.body.data.name).to.eql('Brian')
          done()
        })
    })
    
    it('should also return the artist\'s songs', async () => {
      let pete = await Artist.query().insert({ name: 'Skinny Pete' })
      let songs = pete
        .$relatedQuery('songs')
        .insert([
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

      chai.request(app)
        .get(`/artists/${pete.id}`)
        .end((err, res) => {
          expect(res.body).to.have.status(200)
          let artist = res.body.data;
          expect(artist).to.be.an('object')
          expect(artist.name).to.eql('Skinny Pete')
          expect(artist.songs).to.be.an('array')
          expect(artist.songs.length).to.eql(2)
        })
    })
  })
  */
})
