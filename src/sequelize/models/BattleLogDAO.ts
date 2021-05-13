import { DataTypes, Model } from 'sequelize'
import sequelize from '..'

class BattleLogDAO extends Model {
  public id!: number
  public battleResultID!: string
  public turn!: number
  public assailantID!: string
  public assailedID!: string
  public assailantRemainingHealth!: number
  public assailedRemainingHealth!: number
  public attackRange!: number
  public damageTaken!: number
}

BattleLogDAO.init(
  {
    id: {
      type: DataTypes.NUMBER,
      autoIncrement: true,
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
  },
  {
    tableName: 'BattleLog',
    sequelize,
  }
)

export default BattleLogDAO
