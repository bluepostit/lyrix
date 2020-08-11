
exports.up = function(knex) {
  return knex.schema.table('song_list_songs', (t) => {
    t.dropForeign('song_list_id')
    t.foreign('song_list_id').references('song_lists.id')
      .onDelete('CASCADE')
  })
};

exports.down = function(knex) {
  return knex.schema.table('song_list_songs', (t) => {
    t.dropForeign('song_list_id')
    t.foreign('song_list_id').references('song_lists.id')
  })
};
