
exports.up = function(knex) {
  const alterQuery = `ALTER TABLE songs
    ADD COLUMN fulltext tsvector
    GENERATED ALWAYS AS (
      setweight(
        to_tsvector('english', coalesce(title, '')), 'A') ||
      setweight(
        to_tsvector('english', coalesce(text, '')), 'B')
    ) STORED`
  return knex.schema.raw(alterQuery)
    .alterTable('songs', function(t) {
      t.index('fulltext', null, 'gin')
  })
};

exports.down = function(knex) {
  return knex.schema.alterTable('songs', function(t) {
    t.dropIndex('fulltext')
    t.dropColumn('fulltext')
  })
};
