import CharacterRepositoryInterface from '../../repository/CharacterRepositoryInterface'
import Character from '../../Character'

export default class InMemoryCharacterRepository
  implements CharacterRepositoryInterface {
  private characters: Character[] = []

  async findAll(): Promise<Character[]> {
    return Promise.resolve(this.characters)
  }

  async save(character: Character): Promise<void> {
    this.characters.push(character)
    return Promise.resolve()
  }

  feed(characters: Character[]) {
    this.characters = characters
  }
}
