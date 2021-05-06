export default interface AuthTokenProviderInterface {
  generateToken(payload: any): Promise<string>
}
