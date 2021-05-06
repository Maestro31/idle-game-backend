import User from '../User'

export default interface UserRepositoryInterface {
  save(user: User): Promise<void>
  findAll(): Promise<User[]>
  userExists(email: string): Promise<boolean>
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
}
