import Character from '../Character'

export default interface CharacterRepositoryInterface {
  save(character: Character): Promise<void>
  findAll(): Promise<Character[]>
}
