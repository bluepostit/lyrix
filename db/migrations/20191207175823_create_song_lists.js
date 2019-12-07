
exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable('song_lists', (t) => {
      t.increments().primary()
      t.string('title').notNull()
      t.integer('user_id').unsigned()
      t.foreign('user_id').references('users.id')
      t.timestamps(true, true)
    }),
    knex.schema.createTable('song_list_songs', (t) => {
      t.increments().primary()
      t.integer('song_list_id').notNull()
      t.foreign('song_list_id').references('song_lists.id')
      t.integer('song_id').notNull()
      t.foreign('song_id').references('songs.id')
      t.integer('position')
      t.timestamps(true, true)
    })
  ])
}

exports.down = function (knex) {
  return Promise.all([
    knex.schema.dropTable('song_lists'),
    knex.schema.dropTable('song_lists')
  ])
}
