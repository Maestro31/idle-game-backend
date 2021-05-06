import jwt from 'jsonwebtoken'
import AuthTokenProviderInterface from '../shared/services/AuthTokenProviderInterface'

export default class JsonWebTokenProvider
  implements AuthTokenProviderInterface {
  async generateToken(payload: any): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        process.env.SECRET_KEY as string,
        (err: Error | null, token: string | undefined) => {
          if (err) return reject(err)
          if (!token) return reject()
          resolve(token)
        }
      )
    })
  }
}
