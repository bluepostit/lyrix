
exports.up = function(knex) {
  // Unfortunately this only works in PostgreSQL v12:
  // const alterQuery = `ALTER TABLE songs
  //   ADD COLUMN fulltext tsvector
  //   GENERATED ALWAYS AS (
  //     setweight(
  //       to_tsvector('english', coalesce(title, '')), 'A') ||
  //     setweight(
  //       to_tsvector('english', coalesce('text', '')), 'B')
  //   ) STORED`
  // return knex.schema.raw(alterQuery)
  //   .alterTable('songs', function(t) {
  //     t.index('fulltext', null, 'gin')
  // })

  const rawQuery = `
    ALTER TABLE songs ADD COLUMN fulltext tsvector;
    UPDATE songs SET fulltext =
      setweight(
        to_tsvector('english', coalesce(title, '')), 'A')
      || ' ' ||
      setweight(
        to_tsvector('english', coalesce(text, '')), 'B');

    CREATE FUNCTION songs_trigger() RETURNS trigger AS $$
    begin
      new.fulltext :=
        setweight(to_tsvector('pg_catalog.english', coalesce(new.title,'')), 'A') ||
        setweight(to_tsvector('pg_catalog.english', coalesce(new.text,'')), 'B');
      return new;
    end
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER fulltext_update BEFORE INSERT OR UPDATE
      ON songs FOR EACH ROW EXECUTE FUNCTION songs_trigger();
  `
  return knex.schema.raw(rawQuery)
    .alterTable('songs', function(t) {
      t.index('fulltext', null, 'gin')
    })
};

exports.down = function(knex) {
  const rawQuery = `
    DROP TRIGGER fulltext_update ON songs;
    DROP FUNCTION songs_trigger();
  `
  return knex.schema.raw(rawQuery)
    .alterTable('songs', function(t) {
      t.dropIndex('fulltext')
      t.dropColumn('fulltext')
    })
};
