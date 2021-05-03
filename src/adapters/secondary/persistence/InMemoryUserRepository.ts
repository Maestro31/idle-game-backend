import UserRepositoryInterface from '../../../core/adapters/secondary/persistence/UserRepositoryInterface'
import User from '../../../core/models/User'

export default class InMemoryUserRepository implements UserRepositoryInterface {
  private users: User[] = []

  async save(user: User): Promise<void> {
    this.users.push(user)
    return Promise.resolve()
  }

  async findAll(): Promise<User[]> {
    return Promise.resolve(this.users)
  }
}
