import { Model, DataTypes } from 'sequelize'
import sequelize from '../'

class UserDAO extends Model {
  public id!: number
  public firstname!: string
  public lastname!: string
  public email!: string
  public hashedPassword!: string
}

UserDAO.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      defaultValue: DataTypes.UUIDV4,
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
  },
  {
    tableName: 'User',
    sequelize,
  }
)

export default UserDAO
