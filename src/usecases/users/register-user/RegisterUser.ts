import HasherAdapterInterface from '../../../core/adapters/HasherAdapterInterface'
import UserRepositoryInterface from '../../../core/adapters/secondary/persistence/UserRepositoryInterface'
import UniqueIdAdapterInterface from '../../../core/adapters/UniqueIdAdapterInterface'
import User from '../../../core/models/User'

export interface UserRegistrationDTO {
  firstname: string
  lastname: string
  email: string
  password: string
}

export default class RegisterUser {
  constructor(
    private userRepository: UserRepositoryInterface,
    private uniqueIdAdapter: UniqueIdAdapterInterface,
    private hasherAdapter: HasherAdapterInterface
  ) {}

  async execute({
    firstname,
    lastname,
    email,
    password,
  }: UserRegistrationDTO): Promise<void> {
    const user = User.fromPrimitives({
      id: this.uniqueIdAdapter.generate(),
      firstname,
      lastname,
      email,
      passwordHash: this.hasherAdapter.hash(password),
    })

    try {
      await this.userRepository.save(user)
    } catch (e) {}
  }
}
