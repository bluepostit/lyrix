const songItemTypes = require('./data/song-item-types')

const insertSongItemType = (knex, type) => {
  return knex('song_item_types')
    .insert({
      name: type.name
    })
    .catch((err) => {
      console.log(err)
    })
}

exports.seed = async function (knex) {
  console.log('Seed: song item types')
  // Deletes ALL existing songs
  await knex('song_items').del()
  await knex('song_item_types').del()

  const promises = []
  songItemTypes.forEach((type) => {
    promises.push(insertSongItemType(knex, type))
  })
  return Promise.all(promises)
}
