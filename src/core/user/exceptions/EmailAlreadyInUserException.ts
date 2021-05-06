export default class EmailAlreadyInUseException extends Error {
  constructor() {
    super('User already exists with this email')
  }
}
