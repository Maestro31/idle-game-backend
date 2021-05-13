'use strict'

module.exports = {
  up: async (queryInterface, { DataTypes }) => {
    await queryInterface.addColumn('BattleResult', 'draw', {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('BattleResult', 'draw')
  },
}
