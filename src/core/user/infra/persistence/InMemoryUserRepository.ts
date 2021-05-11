import UserRepositoryInterface from '../../repositories/UserRepositoryInterface'
import User from '../../User'

export default class InMemoryUserRepository implements UserRepositoryInterface {
  private users: User[] = []

  async save(user: User): Promise<void> {
    this.users.push(user)
  }

  async findAll(): Promise<User[]> {
    return this.users
  }

  async userExists(email: string): Promise<boolean> {
    return !!this.users.find((user) => user.email === email)
  }

  async findByEmail(email: string): Promise<User | null> {
    const foundUser = this.users.find((user) => user.email === email)
    if (!foundUser) return null
    return foundUser
  }

  async findById(id: string): Promise<User | null> {
    const foundUser = this.users.find((user) => user.id === id)
    if (foundUser) return foundUser
    return null
  }

  async exists(user: User): Promise<boolean> {
    return (await this.findById(user.id)) != null
  }

  feed(users: User[]) {
    this.users = users
  }
}
