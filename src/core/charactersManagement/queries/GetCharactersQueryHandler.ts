import QueryHandler from '../../../shared/domain/query/QueryHandler'
import Character from '../Character'
import PlayerRepositoryInterface from '../repositories/PlayerRepositoryInterface'
import GetCharactersQuery from './GetCharactersQuery'

interface CharacterDTO {
  id: string
  name: string
  skillPoints: number
  rank: number
  attack: number
  health: number
  magic: number
  defense: number
  recoveredAt: string
}

export default class GetCharactersQueryHandler
  implements QueryHandler<GetCharactersQuery, Promise<CharacterDTO[]>> {
  constructor(private playerRepository: PlayerRepositoryInterface) {}

  async execute({ userID }: GetCharactersQuery): Promise<CharacterDTO[]> {
    const player = await this.playerRepository.findById(userID)

    const characters = player?.getLivingCharacters() || []
    return characters.map((character) => this.characterToDTO(character))
  }

  private characterToDTO(character: Character): CharacterDTO {
    const props = character.toPrimitives()
    return {
      ...props,
      recoveredAt: props.recoveredAt.toISOString(),
    }
  }
}
