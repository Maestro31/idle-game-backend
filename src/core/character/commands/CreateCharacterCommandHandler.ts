import CharacterRepositoryInterface from '../repository/CharacterRepositoryInterface'
import Character from '../Character'
import CreateCharacterCommand from './CreateCharacterCommand'
import DateProviderInterface from '../../../shared/services/DateProviderInterface'
import CharacterCreatorInterface from '../../game/CharacterCreatorInterface'
import CommandHandler from '../../../shared/domain/command/CommandHandler'
import UniqueIdAdapterInterface from '../../../shared/services/UniqueIdAdapterInterface'
import InvalidArgumentsException from '../../../shared/domain/exceptions/InvalidArgumentException'

export default class CreateCharacterCommandHandler
  implements CommandHandler<CreateCharacterCommand, void> {
  constructor(
    private characterRepository: CharacterRepositoryInterface,
    private uniqueIdAdapter: UniqueIdAdapterInterface,
    private dateProvider: DateProviderInterface,
    private characterCreator: CharacterCreatorInterface
  ) {}

  async execute({ name, ownerID }: CreateCharacterCommand): Promise<void> {
    if (name === '') throw new InvalidArgumentsException('name')

    const character = Character.fromPrimitives({
      ...this.characterCreator.create(name),
      id: this.uniqueIdAdapter.generate(),
      recoveredAt: this.dateProvider.now(),
      ownerID,
    })

    await this.characterRepository.save(character)
  }
}
