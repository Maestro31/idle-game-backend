import Character, { CharacterStatus, Skill } from './Character'
import CharacterLimitReachedException from './exceptions/CharacterLimitReachedException'
import CharacterNotFoundException from './exceptions/CharacterNotFoundException'

export default class Player {
  static readonly CHARACTER_LIMIT = 10

  constructor(readonly id: string, readonly characters: Character[] = []) {}

  getLivingCharacters() {
    return this.characters.filter(
      (character) => character.status === CharacterStatus.LIVING
    )
  }

  addCharacter(
    characterID: string,
    name: string,
    skillPoints: number,
    health: number,
    attack: number,
    magic: number,
    defense: number
  ) {
    if (this.characters.length === Player.CHARACTER_LIMIT)
      throw new CharacterLimitReachedException()

    const character = Character.fromPrimitives({
      id: characterID,
      name,
      skillPoints,
      health,
      attack,
      magic,
      defense,
      rank: 0,
      ownerID: this.id,
      recoveredAt: new Date(),
    })
    this.characters.push(character)
  }

  setCharacterStatusAsDeleted(characterID: string): void {
    const character = this.findCharacterById(characterID)
    character.status = CharacterStatus.DELETED
  }

  incrementCharacterSkill(skill: Skill, characterID: string): void {
    const character = this.findCharacterById(characterID)
    character.incrementSkill(skill)
  }

  findCharacterById(characterID: string): Character {
    const character = this.getLivingCharacters().find(
      (c) => c.id === characterID
    )

    if (!character) throw new CharacterNotFoundException()
    return character
  }
}
