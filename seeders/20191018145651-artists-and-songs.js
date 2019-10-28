'use strict';

module.exports = {
  async up: (queryInterface, Sequelize) => {
    /*
    Add altering commands here.
    Return a promise to correctly handle asynchronicity.
    
    Example:
    return queryInterface.bulkInsert('People', [{
      name: 'John Doe',
      isBetaMember: false
    }], {});
    */
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkInsert('Artists', [
        { name: 'Billy Bob' },
        { name: 'Skinny Pete' },
        { name: 'Slim Sue' },
        { name: 'Jumpin\' Jane' }
      ], { transaction })
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
  
  down: (queryInterface, Sequelize) => {
    /*
    Add reverting commands here.
    Return a promise to correctly handle asynchronicity.
    
    Example:
    return queryInterface.bulkDelete('People', null, {});
    */
  }
};
