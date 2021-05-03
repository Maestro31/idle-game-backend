import HasherAdapterInterface from '../core/adapters/HasherAdapterInterface'

export default class HasherAdapterStub implements HasherAdapterInterface {
  hash(password: string): string {
    return password
  }
}
