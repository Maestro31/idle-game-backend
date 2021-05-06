import UserRepositoryInterface from '../../repository/UserRepositoryInterface'
import User from '../../User'

export default class InMemoryUserRepository implements UserRepositoryInterface {
  private users: User[] = []

  async save(user: User): Promise<void> {
    this.users.push(user)
    return Promise.resolve()
  }

  async findAll(): Promise<User[]> {
    return Promise.resolve(this.users)
  }

  async userExists(email: string): Promise<boolean> {
    return Promise.resolve(!!this.users.find((user) => user.email === email))
  }

  async findByEmail(email: string): Promise<User | null> {
    const foundUser = this.users.find((user) => user.email === email)
    if (foundUser) return Promise.resolve(foundUser)
    return Promise.resolve(null)
  }

  async findById(id: string): Promise<User | null> {
    const foundUser = this.users.find((user) => user.id === id)
    if (foundUser) return Promise.resolve(foundUser)
    return Promise.resolve(null)
  }

  feed(users: User[]) {
    this.users = users
  }
}
