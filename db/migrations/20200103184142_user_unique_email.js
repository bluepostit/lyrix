
exports.up = function (knex) {
  return knex.schema.alterTable('users', (t) => {
    t.string('email').notNull().unique().alter()
  })
}

exports.down = function (knex) {}
