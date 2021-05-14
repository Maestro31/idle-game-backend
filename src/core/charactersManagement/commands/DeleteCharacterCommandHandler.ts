import CommandHandler from '../../../shared/domain/command/CommandHandler'
import PlayerNotFoundException from '../exceptions/PlayerNotFoundException'
import PlayerRepositoryInterface from '../repositories/PlayerRepositoryInterface'
import DeleteCharacterCommand from './DeleteCharacterCommand'

export default class DeleteCharacterCommandHandler
  implements CommandHandler<DeleteCharacterCommand, Promise<void>>
{
  constructor(private playerRepository: PlayerRepositoryInterface) {}
  async execute({
    characterID,
    userID,
  }: DeleteCharacterCommand): Promise<void> {
    const player = await this.playerRepository.findById(userID)
    if (!player) throw new PlayerNotFoundException()

    player.setCharacterStatusAsDeleted(characterID)

    await this.playerRepository.save(player)
  }
}
