import UniqueIdAdapterInterface from '../core/adapters/UniqueIdAdapterInterface'

export default class UniqueIdAdapterStub implements UniqueIdAdapterInterface {
  private fakeId: string = ''

  generate(): string {
    return this.fakeId
  }

  willRespond(id: string) {
    this.fakeId = id
  }
}
