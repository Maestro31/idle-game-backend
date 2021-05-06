import AuthTokenProviderInterface from '../../../shared/services/AuthTokenProviderInterface'
import CommandHandler from '../../../shared/domain/command/CommandHandler'
import HasherAdapterInterface from '../../../shared/services/HasherAdapterInterface'
import InvalidCredentialsException from '../exceptions/InvalidCredentialsException'
import UserRepositoryInterface from '../repository/UserRepositoryInterface'
import LoginCommand from './LoginCommand'

interface LoginResponseDTO {
  user: {
    email: string
    firstname: string
    lastname: string
  }
  authToken: string
}

export default class LoginCommandHandler
  implements CommandHandler<LoginCommand, Promise<LoginResponseDTO>> {
  constructor(
    private userRepository: UserRepositoryInterface,
    private hasherAdapter: HasherAdapterInterface,
    private authTokenProvider: AuthTokenProviderInterface
  ) {}

  async execute({ email, password }: LoginCommand): Promise<LoginResponseDTO> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) throw new InvalidCredentialsException()

    const matchPassword = await this.hasherAdapter.compare(
      password,
      user.hashedPassword
    )
    if (!matchPassword) throw new InvalidCredentialsException()

    return {
      user: {
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
      },
      authToken: await this.authTokenProvider.generateToken({ id: user.id }),
    }
  }
}
