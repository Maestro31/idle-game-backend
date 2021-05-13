import Fighter from '../Fighter'

export default class FighterMapper {
  static toPersistence(fighter: Fighter): any {
    return fighter.toPrimitives()
  }

  static toDomain(raw: any): Fighter {
    return new Fighter(
      raw.id,
      raw.name,
      raw.skillPoints,
      raw.health,
      raw.attack,
      raw.magic,
      raw.defense,
      raw.rank,
      new Date(raw.recoveredAt)
    )
  }
}
