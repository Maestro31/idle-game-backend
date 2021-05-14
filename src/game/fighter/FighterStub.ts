import { CharacterProps } from '../character/CharacterCreator'
import { Fighter } from './Fighter'

export default class FighterStub extends Fighter {
  overrideCharacterWith(attributes: Partial<CharacterProps>): void {
    this.characterProps = {
      ...this.characterProps,
      ...attributes,
    }

    this.remainingHealth = this.characterProps.health
  }
}
