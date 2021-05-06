import HasherAdapterInterface from '../shared/services/HasherAdapterInterface'

export default class HasherAdapterStub implements HasherAdapterInterface {
  hash(password: string): string {
    return password
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return Promise.resolve(password === hash)
  }
}
