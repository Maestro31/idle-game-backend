export class IllegalFightError extends Error {
  constructor() {
    super('Unable to fight when a fighter is dead')
  }
}
