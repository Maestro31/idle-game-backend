import Character from '../Character'

export default class CharacterMapper {
  static toPersistence(character: Character): any {
    const props = character.toPrimitives()
    return {
      ...props,
      recoveredAt: props.recoveredAt,
      status: character.status.toString(),
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
