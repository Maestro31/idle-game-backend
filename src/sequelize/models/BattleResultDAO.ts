import { DataTypes, Model } from 'sequelize'
import sequelize from '..'

class BattleResultDAO extends Model {
  public id!: number
  public winnerID!: string
  public looserID!: string
  public draw!: boolean
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
      allowNull: true,
    },
    looserID: {
      type: DataTypes.UUIDV4,
      allowNull: true,
    },
    draw: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: 'BattleResult',
    sequelize,
  }
)

export default BattleResultDAO
