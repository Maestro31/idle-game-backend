import { DataTypes, Model } from 'sequelize'
import sequelize from '..'

class CharacterDAO extends Model {
  public id!: number
  public name!: string
  public skillPoints!: number
  public rank!: number
  public health!: number
  public attack!: number
  public magic!: number
  public defense!: number
  public recoveredAt!: Date
  public ownerID!: string
}

CharacterDAO.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      defaultValue: DataTypes.UUIDV4,
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
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'living',
    },
    ownerID: {
      type: DataTypes.UUIDV4,
      allowNull: false,
    },
  },
  {
    tableName: 'Character',
    sequelize,
  }
)

export default CharacterDAO
