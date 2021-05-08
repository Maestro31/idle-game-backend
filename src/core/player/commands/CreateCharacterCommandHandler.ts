import CommandHandler from '../../../shared/domain/command/CommandHandler'
import UniqueIdAdapterInterface from '../../../shared/services/UniqueIdAdapterInterface'
import Player from '../Player'
import PlayerRepositoryInterface from '../repositories/PlayerRepositoryInterface'
import CreateCharacterCommand from './CreateCharacterCommand'

export default class CreateCharacterCommandHandler
  implements CommandHandler<CreateCharacterCommand, Promise<void>> {
  constructor(
    private playerRepository: PlayerRepositoryInterface,
    private uniqueIdAdapter: UniqueIdAdapterInterface
  ) {}

  async execute({
    name,
    userID,
    skillPoints,
    health,
    attack,
    magic,
    defense,
  }: CreateCharacterCommand): Promise<void> {
    let player = await this.playerRepository.findById(userID)
    if (!player) {
      player = new Player(userID)
    }

    player.addCharacter(
      this.uniqueIdAdapter.generate(),
      name,
      skillPoints,
      health,
      attack,
      magic,
      defense
    )
    await this.playerRepository.save(player)
  }
}
