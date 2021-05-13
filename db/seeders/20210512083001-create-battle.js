'use strict'

module.exports = {
  up: async (queryInterface, { DataTypes }) => {
    await queryInterface.createTable('BattleResult', {
      id: {
        type: DataTypes.UUIDV4,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      winnerID: {
        type: DataTypes.UUIDV4,
        allowNull: false,
      },
      looserID: {
        type: DataTypes.UUIDV4,
        allowNull: false,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    })

    await queryInterface.createTable('BattleLog', {
      id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
      },
      battleResultID: {
        type: DataTypes.UUIDV4,
        allowNull: false,
      },
      log: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('BattleLog')
    await queryInterface.dropTable('BattleResult')
  },
}
