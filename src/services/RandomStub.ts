import { RandomInterface } from '../shared/services/RandomInterface'

export default class RandomStub implements RandomInterface {
  private nextValue: number

  constructor() {
    this.nextValue = 1
  }

  getValueUntil(max: number): number {
    return Math.min(this.nextValue, max)
  }

  willRespond(nextValue: number) {
    this.nextValue = nextValue
  }
}
