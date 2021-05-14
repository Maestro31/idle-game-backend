import QueryHandler from '../../../shared/domain/query/QueryHandler'
import { CharacterProps } from '../Character'
import PlayerNotFoundException from '../exceptions/PlayerNotFoundException'
import PlayerRepositoryInterface from '../repositories/PlayerRepositoryInterface'
import GetCharacterQuery from './GetCharacterQuery'

export default class GetCharacterQueryHandler
  implements QueryHandler<GetCharacterQuery, Promise<CharacterProps>>
{
  constructor(private playerRepository: PlayerRepositoryInterface) {}

  async execute({
    characterID,
    userID,
  }: GetCharacterQuery): Promise<CharacterProps> {
    const player = await this.playerRepository.findById(userID)

    if (!player) throw new PlayerNotFoundException()

    const character = player.findCharacterById(characterID)
    return character.toPrimitives()
  }
}
