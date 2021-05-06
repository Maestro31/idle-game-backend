import AuthTokenProviderInterface from '../shared/services/AuthTokenProviderInterface'

export default class AuthTokenProviderStub
  implements AuthTokenProviderInterface {
  async generateToken(payload: any): Promise<string> {
    return Promise.resolve('auth-token-stubbed')
  }
}
