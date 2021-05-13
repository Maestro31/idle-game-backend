import { Sequelize } from 'sequelize'
import config from '../../../../db/config.json'

const sequelize = new Sequelize(
  <any>config[<'test' | 'development' | 'production'>process.env['NODE_ENV']]
)

export default sequelize
