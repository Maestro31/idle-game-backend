import { CharacterAttributes } from '../../libs/game/character-creator/CharacterCreator'

export default interface CharacterCreatorInterface {
  create(): CharacterAttributes
}
