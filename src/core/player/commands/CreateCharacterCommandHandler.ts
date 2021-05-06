import CommandHandler from '../../../shared/domain/command/CommandHandler'
import UniqueIdAdapterInterface from '../../../shared/services/UniqueIdAdapterInterface'
import PlayerNotFoundException from '../exceptions/PlayerNotFoundException'
import PlayerRepositoryInterface from '../repostitory/PlayerRepositoryInterface'
import CreateCharacterCommand from './CreateCharacterCommand'

export default class CreateCharacterCommandHandler
  implements CommandHandler<CreateCharacterCommand, Promise<void>> {
  constructor(
    private playerRepository: PlayerRepositoryInterface,
    private uniqueIdAdapter: UniqueIdAdapterInterface
  ) {}

  async execute({ name, userID }: CreateCharacterCommand): Promise<void> {
    const player = await this.playerRepository.findById(userID)
    if (!player) throw new PlayerNotFoundException()

    player.addCharacter(this.uniqueIdAdapter.generate(), name)
    await this.playerRepository.save(player)
  }
}
