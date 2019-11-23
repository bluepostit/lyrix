
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('artists').del()
    .then(function () {
      // Inserts seed entries
      return knex('artists').insert([
        {name: 'Coldplay'},
        {name: 'Oasis'},
        {name: 'Britney Spears'}
      ]);
    });
};
