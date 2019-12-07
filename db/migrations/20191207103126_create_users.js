
exports.up = function (knex) {
  return knex.schema
    .createTable('users', (t) => {
      t.increments().primary()
      t.string('email').notNull()
      t.string('password').notNull()
      t.timestamps(true, true)
    })
}

exports.down = function (knex) {
  return knex.schema.dropTable('users')
}
