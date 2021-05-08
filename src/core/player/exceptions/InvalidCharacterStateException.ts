export default class InvalidCharacterStateException extends Error {
  constructor() {
    super('Character has an invalid state')
  }
}
