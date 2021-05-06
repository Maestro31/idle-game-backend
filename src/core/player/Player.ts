import RealCharacterCreator from '../../game/RealCharacterCreator'
import InvalidArgumentsException from '../../shared/domain/exceptions/InvalidArgumentException'
import Character from '../character/Character'
import CharacterLimitReachedException from './exceptions/CharacterLimitReachedException'

const CHARACTER_LIMIT = 10

export default class Player {
  private characterCreator = new RealCharacterCreator()
  constructor(readonly id: string, private characters: Character[] = []) {}

  getCharacters() {
    return this.characters
  }

  addCharacter(characterID: string, name: string) {
    if (name === '') throw new InvalidArgumentsException('name')
    if (this.characters.length === CHARACTER_LIMIT)
      throw new CharacterLimitReachedException()

    const character = Character.fromPrimitives({
      ...this.characterCreator.create(name),
      id: characterID,
      ownerID: this.id,
    })
    this.characters.push(character)
  }
}
