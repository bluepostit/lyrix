const faker = require('faker')

const Song = require('../../../models/song')
const User = require('../../../models/user')

const USERS_TO_CREATE = 20
const SONGS_TO_ADD_TO_LIST = 3

const getRandomSongs = (count) => {
  const songs = Song
    .query()
    .orderByRaw('RANDOM()')
    .limit(count)
  return songs
}

const createSonglist = (user) => {
  // console.log(`creating song list for ${user.email}`)
  return getRandomSongs(SONGS_TO_ADD_TO_LIST).then((songs) => {
    const songIds = songs.map((song) => ({ id: song.id }))
    return user
      .$relatedQuery('songLists')
      .insertGraph(
        [
          {
            title: faker.lorem.words(3),
            songs: songIds
          }
        ],
        {
          relate: true
        }
      )
  })
}

exports.seed = async function (knex) {
  console.log('Seed: users with songlists')
  await knex('song_list_songs').del()
  await knex('song_lists').del()
  await knex('users').del()

  const users = []
  for (let i = 0; i < USERS_TO_CREATE; i++) {
    const data = {
      email: faker.internet.exampleEmail(),
      password: '123456'
    }
    const user = await User.createUser(data)
    users.push(user)
  }

  const promises = []
  users.forEach((user) => {
    promises.push(createSonglist(user))
  })
  return Promise.all(promises)
}
