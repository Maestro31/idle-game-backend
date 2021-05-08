import { UserDAO } from '../../../../infra/persistence/sequelize/models'
import UserMapper from '../../mappers/UserMapper'
import UserRepositoryInterface from '../../repositories/UserRepositoryInterface'
import User from '../../User'

export default class SequelizeUserRepository
  implements UserRepositoryInterface {
  async save(user: User): Promise<void> {
    const rawUser = UserMapper.toPersistence(user)
    const exists = await this.exists(user)
    if (!exists) {
      UserDAO.create(rawUser)
    } else {
      UserDAO.update(rawUser, { where: { id: user.id } })
    }
  }

  async findAll(): Promise<User[]> {
    throw new Error('Method not implemented.')
  }

  async userExists(email: string): Promise<boolean> {
    return (await this.findByEmail(email)) !== null
  }

  async findByEmail(email: string): Promise<User | null> {
    const userDao = await UserDAO.findOne({ where: { email } })
    if (!userDao) return null
    return UserMapper.toDomain(userDao)
  }

  async findById(id: string): Promise<User | null> {
    const userDao = await UserDAO.findByPk(id)
    if (!userDao) return null
    return UserMapper.toDomain(userDao)
  }

  async exists(user: User): Promise<boolean> {
    return (await UserDAO.findByPk(user.id)) !== null
  }
}
