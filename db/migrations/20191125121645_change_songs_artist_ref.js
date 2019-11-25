
exports.up = function (knex) {
  return knex.schema.alterTable('songs', (t) => {
    t.dropForeign('artist')
    t.dropColumn('artist')
    t.integer('artist_id').unsigned()
    t.foreign('artist_id').references('artists.id')
  })
}

exports.down = function (knex) {}
