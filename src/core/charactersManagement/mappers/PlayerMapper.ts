import Player from '../Player'
import CharacterMapper from './CharacterMapper'

export default class PlayerMapper {
  static toPersistence(player: Player): any {
    return {
      userID: player.id,
      characters: player.characters.map((character) =>
        CharacterMapper.toPersistence(character)
      ),
    }
  }

  static toDomain(raw: any): Player {
    return new Player(
      raw.userID,
      raw.characters.map((rawCharacter: any) =>
        CharacterMapper.toDomain(rawCharacter)
      )
    )
  }
}
