import { CharacterProps } from '../character/Character'

export default interface CharacterCreatorInterface {
  create(name: string): CharacterProps
}
