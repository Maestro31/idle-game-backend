import User from '../User'
import RegistrationCommand from './RegistrationCommand'
import EmailAlreadyInUseException from '../exceptions/EmailAlreadyInUseException'
import UserRepositoryInterface from '../repositories/UserRepositoryInterface'
import HasherAdapterInterface from '../../../shared/services/HasherAdapterInterface'
import UniqueIdAdapterInterface from '../../../shared/services/UniqueIdAdapterInterface'
import CommandHandler from '../../../shared/domain/command/CommandHandler'
import RegistrationCommandValidator from '../validations/RegistrationCommandValidator'

export default class RegisterUserCommandHandler
  implements CommandHandler<RegistrationCommand, void>
{
  constructor(
    private userRepository: UserRepositoryInterface,
    private uniqueIdAdapter: UniqueIdAdapterInterface,
    private hasherAdapter: HasherAdapterInterface
  ) {}

  async execute(payload: RegistrationCommand): Promise<void> {
    RegistrationCommandValidator.validate(payload)

    if (await this.userRepository.userExists(payload.email)) {
      throw new EmailAlreadyInUseException()
    }

    const user = User.fromPrimitives({
      id: this.uniqueIdAdapter.generate(),
      firstname: payload.firstname,
      lastname: payload.lastname,
      email: payload.email,
      hashedPassword: this.hasherAdapter.hash(payload.password),
    })

    await this.userRepository.save(user)
  }
}
