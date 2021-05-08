import { DataTypes, Model } from 'sequelize'
import sequelize from '../'

class PlayerDAO extends Model {
  public id!: number
  public userID!: string
}

PlayerDAO.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userID: {
      type: DataTypes.UUIDV4,
      allowNull: false,
    },
  },
  {
    tableName: 'Player',
    sequelize,
  }
)

export default PlayerDAO
