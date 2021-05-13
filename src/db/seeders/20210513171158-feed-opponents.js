'use strict'

const { v4: uuid } = require('uuid')
const bcrypt = require('bcrypt')

function createUser(id, firstname, lastname) {
  return {
    id,
    firstname,
    lastname,
    email: `${firstname.toLowerCase()}@${lastname.toLowerCase()}.com`,
    hashedPassword: bcrypt.hashSync('123456', 10),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

function createCharacter(n, userID) {
  return {
    id: uuid(),
    name: `character-${n}`,
    skillPoints: 0,
    health: 11 + n,
    attack: 5,
    magic: 4,
    defense: 2,
    recoveredAt: new Date(),
    status: 'living',
    rank: n,
    ownerID: userID,
  }
}

function feedCharacters(userID) {
  const characters = []
  for (let i = 0; i < 10; i++) {
    characters.push(createCharacter(i, userID))
  }
  return characters
}

async function createUserWithPlayerAndCharacters(
  queryInterface,
  firstname,
  lastname
) {
  const userID = uuid()
  await queryInterface.bulkInsert('User', [
    createUser(userID, firstname, lastname),
  ])
  await queryInterface.bulkInsert('Player', [{ userID }])
  await queryInterface.bulkInsert('Character', feedCharacters(userID))
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await createUserWithPlayerAndCharacters(
      queryInterface,
      'Jack',
      'Skellington'
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('User', null)
    await queryInterface.bulkDelete('Character', null)
    await queryInterface.bulkDelete('Player', null)
  },
}
