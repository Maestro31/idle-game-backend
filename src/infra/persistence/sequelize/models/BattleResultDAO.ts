import { DataTypes, Model } from 'sequelize'
import sequelize from '..'

class BattleResultDAO extends Model {
  public id!: number
  public winnerID!: string
  public looserID!: string
}

BattleResultDAO.init(
  {
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
  },
  {
    tableName: 'BattleResult',
    sequelize,
  }
)

export default BattleResultDAO
