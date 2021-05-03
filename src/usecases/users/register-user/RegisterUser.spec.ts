import InMemoryUserRepository from '../../../adapters/secondary/persistence/InMemoryUserRepository'
import RegisterUser from './RegisterUser'
import UniqueIdAdapterStub from '../../../adapters/UniqueIdAdaperStub'
import HasherAdapterStub from '../../../adapters/HasherAdapterStub'

describe('Register User', () => {
  let registerUser: RegisterUser
  let userRepository: InMemoryUserRepository
  let uniqueIdAdapter: UniqueIdAdapterStub
  let hasherAdapter: HasherAdapterStub

  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    uniqueIdAdapter = new UniqueIdAdapterStub()
    hasherAdapter = new HasherAdapterStub()
    registerUser = new RegisterUser(
      userRepository,
      uniqueIdAdapter,
      hasherAdapter
    )
  })

  it('should register the user with the given informations', async () => {
    uniqueIdAdapter.willRespond('uuid-1')

    await registerUser.execute({
      firstname: 'John',
      lastname: 'Snow',
      email: 'test@test.fr',
      password: 'test1234',
    })

    const user = (await userRepository.findAll())[0]

    expect(user.toPrimitives()).toEqual({
      id: 'uuid-1',
      firstname: 'John',
      lastname: 'Snow',
      email: 'test@test.fr',
      passwordHash: 'test1234',
    })
  })
})
