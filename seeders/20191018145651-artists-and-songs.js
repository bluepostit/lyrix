'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      let now = new Date()
      await queryInterface.bulkInsert('Artists', [
        { name: 'Billy Bob', createdAt: now, updatedAt: now },
        { name: 'Skinny Pete', createdAt: now, updatedAt: now },
        { name: 'Slim Sue', createdAt: now, updatedAt: now },
        { name: 'Jumpin\' Jane', createdAt: now, updatedAt: now }
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
