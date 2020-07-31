
exports.up = function(knex) {
  return Promise.all([
    knex.schema.createTable('song_item_types', (t) => {
      t.increments().primary()
      t.string('name').notNull()
      t.unique('name')
      t.timestamps(true, true)
    }),
    knex.schema.createTable('song_items', (t) => {
      t.increments().primary()
      t.string('title').notNull()
      t.integer('user_id').unsigned().notNull()
      t.integer('song_id').notNull()
      t.integer('song_item_type_id').unsigned().notNull()
      t.text('text').notNull()

      t.foreign('user_id').references('users.id')
      t.foreign('song_id').references('songs.id')
      t.foreign('song_item_type_id').references('song_item_types.id')
      t.timestamps(true, true)
    })
  ])
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTable('song_items'),
    knex.schema.dropTable('song_item_types')
  ])
};
