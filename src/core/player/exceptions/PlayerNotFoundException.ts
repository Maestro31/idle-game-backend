export default class PlayerNotFoundException extends Error {
  constructor() {
    super('Player not found with the given user ID')
  }
}
