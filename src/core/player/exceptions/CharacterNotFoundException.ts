export default class CharacterNotFoundException extends Error {
  constructor() {
    super('Character not found whith the given id')
  }
}
