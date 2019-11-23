
exports.up = function(knex) {
  return knex.schema
  .createTable('artists', (t) => {
    t.increments('id').primary()
    t.string('name').notNull()
    // Does not work as expected on Postgres.
    // See https://stackoverflow.com/questions/36728899/knex-js-auto-update-trigger
    t.timestamps(true, true)
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('artists')
};
