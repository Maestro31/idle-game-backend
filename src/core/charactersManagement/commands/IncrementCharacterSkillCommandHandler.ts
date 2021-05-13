import CommandHandler from '../../../shared/domain/command/CommandHandler'
import PlayerNotFoundException from '../exceptions/PlayerNotFoundException'
import PlayerRepositoryInterface from '../repositories/PlayerRepositoryInterface'
import IncrementCharacterSkillCommand from './IncrementCharacterSkillCommand'
import { Skill } from '../Character'

export default class IncrementCharacterSkillCommandHandler
  implements CommandHandler<IncrementCharacterSkillCommand, Promise<void>> {
  constructor(private playerRepository: PlayerRepositoryInterface) {}
  async execute({
    skill,
    userID,
    characterID,
  }: IncrementCharacterSkillCommand): Promise<void> {
    const player = await this.playerRepository.findById(userID)
    if (!player) throw new PlayerNotFoundException()

    player.incrementCharacterSkill(skill as Skill, characterID)
    await this.playerRepository.save(player)
  }
}
