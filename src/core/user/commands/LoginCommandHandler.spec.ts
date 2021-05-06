import AuthTokenProviderStub from '../../../services/AuthTokenProviderStub'
import InMemoryUserRepository from '../infra/persistence/InMemoryUserRepository'
import User from '../User'
import InvalidCredentialsException from '../exceptions/InvalidCredentialsException'
import LoginCommandHandler from './LoginCommandHandler'
import HasherAdapterStub from '../../../services/HasherAdapterStub'

describe('Login user', () => {
  let userRepository: InMemoryUserRepository
  let hasherAdapter: HasherAdapterStub
  let loginUser: LoginCommandHandler
  let authTokenProvider: AuthTokenProviderStub

  beforeEach(() => {
    hasherAdapter = new HasherAdapterStub()
    userRepository = new InMemoryUserRepository()
    authTokenProvider = new AuthTokenProviderStub()
    loginUser = new LoginCommandHandler(
      userRepository,
      hasherAdapter,
      authTokenProvider
    )

    const user = User.fromPrimitives({
      id: 'uuid-1',
      firstname: 'John',
      lastname: 'Snow',
      email: 'test@test.fr',
      hashedPassword: '12345',
    })

    userRepository.feed([user])
  })

  it('should authentify the given user', async () => {
    expect(
      await loginUser.execute({
        email: 'test@test.fr',
        password: '12345',
      })
    ).toEqual({
      user: {
        email: 'test@test.fr',
        firstname: 'John',
        lastname: 'Snow',
      },
      authToken: 'auth-token-stubbed',
    })
  })

  it('should throwing and error when user is not found with the given email', async () => {
    await expect(
      loginUser.execute({
        email: 'invalid@test.fr',
        password: '12345',
      })
    ).rejects.toThrowError(InvalidCredentialsException)
  })

  it('should throwing and error when the password is incorrect with the given email', async () => {
    await expect(
      loginUser.execute({
        email: 'test@test.fr',
        password: 'bad_password',
      })
    ).rejects.toThrowError(InvalidCredentialsException)
  })
})
