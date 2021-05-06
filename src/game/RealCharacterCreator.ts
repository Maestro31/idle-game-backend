import { CharacterProps } from '../core/character/Character'
import CharacterCreatorInterface from '../core/game/CharacterCreatorInterface'
import CharacterCreator from '../libs/game/character-creator/CharacterCreator'

export default class RealCharacterCreator implements CharacterCreatorInterface {
  private characterCreator = new CharacterCreator()

  create(name: string): CharacterProps {
    return this.characterCreator.createCharacterProps(name)
  }
}
