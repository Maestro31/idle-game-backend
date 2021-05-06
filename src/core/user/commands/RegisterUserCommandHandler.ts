import User from '../User'
import RegistrationCommand from './RegistrationCommand'
import EmailAlreadyInUseException from '../exceptions/EmailAlreadyInUserException'
import UserValidator from '../validations/UserValidator'
import UserRepositoryInterface from '../repository/UserRepositoryInterface'
import HasherAdapterInterface from '../../../shared/services/HasherAdapterInterface'
import UniqueIdAdapterInterface from '../../../shared/services/UniqueIdAdapterInterface'
import CommandHandler from '../../../shared/domain/command/CommandHandler'

export default class RegisterUserCommandHandler
  implements CommandHandler<RegistrationCommand, void> {
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
  }: RegistrationCommand): Promise<void> {
    if (await this.userRepository.userExists(email)) {
      throw new EmailAlreadyInUseException()
    }

    const user = User.fromPrimitives({
      id: this.uniqueIdAdapter.generate(),
      firstname,
      lastname,
      email,
      hashedPassword: this.hasherAdapter.hash(password),
    })

    const userValidator = new UserValidator()
    userValidator.validate(user)

    await this.userRepository.save(user)
  }
}
