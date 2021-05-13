import QueryHandler from '../../../shared/domain/query/QueryHandler'
import UserNotFoundException from '../exceptions/UserNotFoundException'
import UserMapper from '../mappers/UserMapper'
import UserRepositoryInterface from '../repositories/UserRepositoryInterface'
import GetUserQuery from './GetUserQuery'

interface UserWithoutPasswordDTO {
  firstname: string
  lastname: string
  email: string
}

export default class GetUserQueryHandler
  implements QueryHandler<GetUserQuery, Promise<UserWithoutPasswordDTO>> {
  constructor(private userRepository: UserRepositoryInterface) {}

  async execute({ userID }: GetUserQuery): Promise<UserWithoutPasswordDTO> {
    const user = await this.userRepository.findById(userID)
    if (!user) throw new UserNotFoundException()

    return {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
    }
  }
}
