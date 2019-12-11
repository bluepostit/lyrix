const songs = require('./data/songs')

const insertSong = (knex, song) => {
  // Find the artist
  return knex('artists')
    .where('name', song.artist)
    .first()
    .then((artist) => {
      return knex('songs')
        .insert({
          title: song.title,
          text: song.text,
          artist_id: artist.id
        })
    })
    .catch((err) => {
      console.log(err)
    })
}

exports.seed = async function (knex) {
  console.log('Seed: songs')
  // Deletes ALL existing songs
  await knex('song_list_songs').del()
  await knex('song_lists').del()
  await knex('songs').del()

  const promises = []
  songs.forEach((song) => {
    promises.push(insertSong(knex, song))
  })
  return Promise.all(promises)
}
