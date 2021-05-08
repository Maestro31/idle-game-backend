import Repository from '../../../../shared/infra/persistence/repository/Repository'
import Character, { CharacterStatus } from '../../Character'

export default class InMemoryCharacterRepository
  implements Repository<Character> {
  private characters: Character[] = []

  async save(character: Character): Promise<void> {
    if (await this.exists(character))
      this.characters = this.characters.map((c) =>
        c.id === character.id ? character : c
      )
    else this.characters.push(character)
  }

  async findAll(): Promise<Character[]> {
    return Promise.resolve(this.getLivingCharacters())
  }

  async findById(id: string): Promise<Character | null> {
    const foundCharacter = this.getLivingCharacters().find(
      (character) => character.id === id
    )
    if (!foundCharacter) return Promise.resolve(null)
    return Promise.resolve(foundCharacter)
  }

  async exists(character: Character): Promise<boolean> {
    return (await this.findById(character.id)) !== null
  }

  feed(characters: Character[]) {
    this.characters = characters
  }

  private getLivingCharacters() {
    return this.characters.filter(
      (character) => character.getStatus() !== CharacterStatus.DELETED
    )
  }
}
