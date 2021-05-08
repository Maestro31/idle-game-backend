import Character from '../Character'

export default class CharacterMapper {
  static toPersistence(character: Character): any {
    return {
      id: character.id,
      name: character.name,
      skillPoints: character.skillPoints,
      health: character.health,
      attack: character.attack,
      magic: character.magic,
      defense: character.defense,
      rank: character.rank,
      recoveredAt: character.recoveredAt,
      status: character.getStatus().toString(),
      ownerID: character.ownerID,
    }
  }

  static toDomain(raw: any): Character {
    return new Character(
      raw.id,
      raw.name,
      raw.skillPoints,
      raw.health,
      raw.attack,
      raw.magic,
      raw.defense,
      raw.rank,
      new Date(raw.recoveredAt),
      raw.status,
      raw.ownerID
    )
  }
}
