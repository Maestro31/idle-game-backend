import User from '../../../models/User'

export default interface UserRepositoryInterface {
  save(user: User): Promise<void>
  findAll(): Promise<User[]>
}
