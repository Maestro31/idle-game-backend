import DateProviderInterface from '../shared/services/DateProviderInterface'

export default class DateProviderStub implements DateProviderInterface {
  private date: Date = new Date()

  now(): Date {
    return this.date
  }

  willRespond(date: Date) {
    this.date = date
  }
}
