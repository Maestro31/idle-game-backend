export default class CharacterLimitReachedException extends Error {
  constructor() {
    super('Player cannot have more than 10 characters')
  }
}
