import InMemoryUserRepository from '../infra/persistence/InMemoryUserRepository'
import RegisterUserCommandHandler from './RegisterUserCommandHandler'

import User from '../User'
import UniqueIdAdapterStub from '../../../services/UniqueIdAdaperStub'
import HasherAdapterStub from '../../../services/HasherAdapterStub'

describe('Register User', () => {
  let registerUser: RegisterUserCommandHandler
  let userRepository: InMemoryUserRepository
  let uniqueIdAdapter: UniqueIdAdapterStub
  let hasherAdapter: HasherAdapterStub

  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    uniqueIdAdapter = new UniqueIdAdapterStub()
    hasherAdapter = new HasherAdapterStub()
    registerUser = new RegisterUserCommandHandler(
      userRepository,
      uniqueIdAdapter,
      hasherAdapter
    )
  })

  describe('Validation', () => {
    for (const field of ['firstname', 'lastname', 'email', 'password']) {
      it(`should throwing an error if the ${field} is empty`, async () => {
        await expect(
          registerUser.execute({
            firstname: 'John',
            lastname: 'Snow',
            email: 'test@test.fr',
            password: 'test1234',
            [field]: '',
          })
        ).rejects.toThrow(`Field ${field} could not be empty`)
      })
    }

    for (const field of ['firstname', 'lastname', 'email', 'password']) {
      it(`should throwing an error if the ${field} is null`, async () => {
        await expect(
          registerUser.execute({
            firstname: 'John',
            lastname: 'Snow',
            email: 'test@test.fr',
            password: 'test1234',
            [field]: null,
          })
        ).rejects.toThrow(`Field ${field} could not be empty`)
      })
    }

    it('should throwing and error if the email given has an invalid format', async () => {
      await expect(
        registerUser.execute({
          firstname: 'Daenerys',
          lastname: 'Targaryen',
          email: 'invalid',
          password: 'test1234',
        })
      ).rejects.toThrow(`Field email has invalid format`)
    })
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
      hashedPassword: 'test1234',
    })
  })

  it('should throwing an error when email given already in use', async () => {
    const user = User.fromPrimitives({
      id: 'uuid-1',
      firstname: 'John',
      lastname: 'Snow',
      email: 'john.snow@rox.com',
      hashedPassword: '1234',
    })

    userRepository.feed([user])
    uniqueIdAdapter.willRespond('uuid-2')

    await expect(
      registerUser.execute({
        firstname: 'Daenerys',
        lastname: 'Targaryen',
        email: 'john.snow@rox.com',
        password: 'test1234',
      })
    ).rejects.toThrow('User already exists with this email')
  })
})
