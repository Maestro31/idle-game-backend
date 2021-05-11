export default class NotReadyFighterException extends Error {
  constructor() {
    super('The fighter is not ready for the battle actually')
  }
}
