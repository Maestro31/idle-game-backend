'use strict'

module.exports = {
  up: async (queryInterface, { DataTypes }) => {
    await queryInterface.createTable('User', {
      id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      hashedPassword: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    })

    await queryInterface.createTable('Player', {
      id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userID: {
        type: DataTypes.UUIDV4,
        allowNull: false,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    })

    await queryInterface.createTable('Character', {
      id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      skillPoints: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      rank: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      health: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      attack: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      magic: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      defense: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      recoveredAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      ownerID: {
        type: DataTypes.UUIDV4,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropAllTables()
  },
}
