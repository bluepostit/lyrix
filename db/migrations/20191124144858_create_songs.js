
exports.up = function (knex) {
  return knex.schema
    .createTable('songs', (t) => {
      t.increments().primary()
      t.string('title').notNull()
      t.text('text').notNull()
      t.timestamps(true, true)
    })
}

exports.down = function (knex) {
  return knex.schema.dropTable('songs')
}
