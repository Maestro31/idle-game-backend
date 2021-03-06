import { RandomInterface } from '../shared/services/RandomInterface'

export default class RealRandom implements RandomInterface {
  getValueUntil(max: number): number {
    return Math.floor(Math.random() * max)
  }
}
