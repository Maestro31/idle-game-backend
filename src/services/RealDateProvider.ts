import DateProviderInterface from '../shared/services/DateProviderInterface'

export default class RealDateProvider implements DateProviderInterface {
  now(): Date {
    return new Date()
  }
}
