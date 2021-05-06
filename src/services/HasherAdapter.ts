import HasherAdapterInterface from '../shared/services/HasherAdapterInterface'
import bcrypt from 'bcrypt'

export default class HasherAdapter implements HasherAdapterInterface {
  hash(password: string): string {
    return bcrypt.hashSync(password, 10)
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash)
  }
}
