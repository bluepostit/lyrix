
exports.up = function(knex) {
  return knex.schema.alterTable('users', (t) => {
    t.boolean('admin').notNullable().defaultTo(false)
  })
};

exports.down = function(knex) {
  return knex.schema.alterTable('users', (t) => {
    t.dropColumn('admin')
  })
};
