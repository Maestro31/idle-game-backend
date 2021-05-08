export default class UserNotFoundException extends Error {
  constructor() {
    super('User not found')
  }
}
