const artists = [
  'Black Eyed Peas',
  'Bob Dylan',
  'Britney Spears',
  'Coldplay',
  'Counting Crows',
  'Eminem',
  'George Harrison',
  'Green Day',
  'Jimmy Eat World',
  'Keane',
  'Lady Gaga',
  'Madonna',
  'Oasis',
  'Outkast',
  'R.E.M.',
  'Taksim Trio',
  'The Shins',
  'Toploader',
  'U2',
  'Van Morrison'
]

exports.seed = async function (knex) {
  console.log('Seed: artists')
  // Deletes ALL existing entries
  await knex('song_items').del()
  await knex('song_list_songs').del()
  await knex('song_lists').del()
  await knex('songs').del()
  await knex('artists').del()

  const artistObjects = artists.map(name => ({ name }))
  // Inserts seed entries
  return knex('artists').insert(artistObjects)
}
