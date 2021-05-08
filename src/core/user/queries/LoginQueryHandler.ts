import AuthTokenProviderInterface from '../../../shared/services/AuthTokenProviderInterface'
import HasherAdapterInterface from '../../../shared/services/HasherAdapterInterface'
import InvalidCredentialsException from '../exceptions/InvalidCredentialsException'
import UserRepositoryInterface from '../repositories/UserRepositoryInterface'
import LoginQuery from './LoginQuery'
import QueryHandler from '../../../shared/domain/query/QueryHandler'

interface LoginResponseDTO {
  user: {
    email: string
    firstname: string
    lastname: string
  }
  authToken: string
}

export default class LoginQueryHandler
  implements QueryHandler<LoginQuery, Promise<LoginResponseDTO>> {
  constructor(
    private userRepository: UserRepositoryInterface,
    private hasherAdapter: HasherAdapterInterface,
    private authTokenProvider: AuthTokenProviderInterface
  ) {}

  async execute({ email, password }: LoginQuery): Promise<LoginResponseDTO> {
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
