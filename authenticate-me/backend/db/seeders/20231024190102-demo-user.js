'use strict';
const bcrypt = require("bcryptjs");
const {Op} = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await queryInterface.bulkInsert('Users', [
    {
      username: 'pyaekyaw',
      firstName: 'Joe',
      lastName: 'Cena',
      email: 'jjpyae@gmail.com',
      hashedPassword: bcrypt.hashSync('password')
    },
    {
      email: 'user1@user.io',
      firstName: 'John',
      lastName: 'Smith',
      username: 'FakeUser1',
      hashedPassword: bcrypt.hashSync('password2')
    },
    {
      email: 'user2@user.io',
      firstName: 'Jane',
      lastName: 'Smith',
      username: 'FakeUser2',
      hashedPassword: bcrypt.hashSync('password3')
    }
  ], {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2']}
    })
  }
};
