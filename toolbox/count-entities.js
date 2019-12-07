process.env.NODE_ENV = 'test'

console.log(`DB info for env ### ${process.env.NODE_ENV} ###:`)

const Artist = require('./models/artist')
const Song = require('./models/song')
const SongList = require('./models/song-list')
const User = require('./models/user')

;(async () => {
  console.log(await Artist.query().count())
  console.log(await Song.query().count())
  console.log(await SongList.query().count())
  console.log(await User.query().count())
})()
