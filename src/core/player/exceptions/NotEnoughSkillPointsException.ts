export default class NotEnoughSkillPointsException extends Error {
  constructor() {
    super('Not enough skill points to increment this skill')
  }
}
