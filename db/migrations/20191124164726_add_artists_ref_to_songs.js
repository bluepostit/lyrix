
exports.up = function (knex) {
  return knex.schema.alterTable('songs', (t) => {
    t.integer('artist').unsigned().notNullable()

    t.foreign('artist').references('id').inTable('artists')
  })
}

exports.down = function (knex) {
  return knex.schema.alterTable('songs', (t) => {
    t.dropColumn('artist')
  })
}
