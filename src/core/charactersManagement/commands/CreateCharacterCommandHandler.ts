import CommandHandler from '../../../shared/domain/command/CommandHandler'
import UniqueIdAdapterInterface from '../../../shared/services/UniqueIdAdapterInterface'
import Player from '../Player'
import PlayerRepositoryInterface from '../repositories/PlayerRepositoryInterface'
import CreateCharacterCommandValidation from '../validations/CreateCharacterCommandValidation'
import CreateCharacterCommand from './CreateCharacterCommand'

export default class CreateCharacterCommandHandler
  implements CommandHandler<CreateCharacterCommand, Promise<void>>
{
  constructor(
    private playerRepository: PlayerRepositoryInterface,
    private uniqueIdAdapter: UniqueIdAdapterInterface
  ) {}

  async execute(payload: CreateCharacterCommand): Promise<void> {
    CreateCharacterCommandValidation.validate(payload)
    let player = await this.playerRepository.findById(payload.userID)
    if (!player) {
      player = new Player(payload.userID)
    }

    player.addCharacter(
      this.uniqueIdAdapter.generate(),
      payload.name,
      payload.skillPoints,
      payload.health,
      payload.attack,
      payload.magic,
      payload.defense
    )
    await this.playerRepository.save(player)
  }
}
