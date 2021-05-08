import Repository from '../../../shared/infra/persistence/repository/Repository'
import User from '../User'

export default interface UserRepositoryInterface extends Repository<User> {
  findByEmail(email: string): Promise<User | null>
  userExists(email: string): Promise<boolean>
}
