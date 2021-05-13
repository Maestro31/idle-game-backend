import { Sequelize } from 'sequelize'
import config from '../db/config.json'

const sequelize = new Sequelize(
  config[process.env.NODE_ENV as 'test' | 'development' | 'production'] as any
)

export default sequelize
