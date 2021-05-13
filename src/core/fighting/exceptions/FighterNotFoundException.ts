export default class FighterNotFoundException extends Error {
  constructor() {
    super('Fighter not found with the given id')
  }
}
