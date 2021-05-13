'use strict'

const { v4: uuid } = require('uuid')
const bcrypt = require('bcrypt')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userID = uuid()
    await queryInterface.bulkInsert('User', [
      {
        id: userID,
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@doe.com',
        hashedPassword: bcrypt.hashSync('123456', 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])

    await queryInterface.bulkInsert('Player', [{ userID }])

    await queryInterface.bulkInsert('Character', [
      {
        id: uuid(),
        name: 'Jack-1',
        health: 10,
        skillPoints: 0,
        attack: 6,
        magic: 3,
        defense: 3,
        rank: 0,
        recoveredAt: new Date(),
        ownerID: userID,
        status: 'living',
      },
      {
        id: uuid(),
        name: 'Jack-2',
        health: 11,
        skillPoints: 1,
        attack: 5,
        magic: 3,
        defense: 3,
        rank: 1,
        recoveredAt: new Date(),
        ownerID: userID,
        status: 'living',
      },
      {
        id: uuid(),
        name: 'Jack-3',
        health: 13,
        skillPoints: 0,
        attack: 4,
        magic: 4,
        defense: 3,
        rank: 3,
        recoveredAt: new Date(),
        ownerID: userID,
        status: 'living',
      },
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('User', null)
    await queryInterface.bulkDelete('Character', null)
    await queryInterface.bulkDelete('Player', null)
  },
}
