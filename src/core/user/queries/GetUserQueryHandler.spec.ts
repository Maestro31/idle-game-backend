import UserNotFoundException from '../exceptions/UserNotFoundException'
import InMemoryUserRepository from '../infra/persistence/InMemoryUserRepository'
import User from '../User'
import GetUserQueryHandler from './GetUserQueryHandler'

describe('Get User', () => {
  let userRepository: InMemoryUserRepository
  let getUser: GetUserQueryHandler

  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    getUser = new GetUserQueryHandler(userRepository)
  })

  it('should retrieve the current user for the given id', async () => {
    const user = User.fromPrimitives({
      id: 'uuid-user-1',
      firstname: 'Jack',
      lastname: 'Skellington',
      email: 'jack@skellington.com',
      hashedPassword: '12345',
    })

    userRepository.feed([user])

    const foundUserDto = await getUser.execute({ userID: user.id })
    expect(foundUserDto).toEqual({
      firstname: 'Jack',
      lastname: 'Skellington',
      email: 'jack@skellington.com',
    })
  })

  it('should throwing an error when user does not exists', async () => {
    await expect(
      getUser.execute({ userID: 'not-exits-user-id' })
    ).rejects.toThrowError(UserNotFoundException)
  })
})
