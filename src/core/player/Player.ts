import InvalidArgumentsException from '../../shared/domain/exceptions/InvalidArgumentException'
import Character, { CharacterStatus } from './Character'
import CharacterLimitReachedException from './exceptions/CharacterLimitReachedException'
import CharacterNotFoundException from './exceptions/CharacterNotFoundException'
import InvalidCharacterStateException from './exceptions/InvalidCharacterStateException'

const CHARACTER_LIMIT = 10

export default class Player {
  constructor(readonly id: string, readonly characters: Character[] = []) {}

  getLivingCharacters() {
    return this.characters.filter(
      (character) => character.getStatus() === CharacterStatus.LIVING
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
    if (name === '') throw new InvalidArgumentsException('name')
    if (this.characters.length === CHARACTER_LIMIT)
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
    if (!character) throw new CharacterNotFoundException()
    character.setStatus(CharacterStatus.DELETED)
  }

  private findCharacterById(characterID: string): Character | undefined {
    return this.characters.find((character) => character.id === characterID)
  }
}
