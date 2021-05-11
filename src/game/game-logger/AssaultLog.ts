import { CharacterProps } from '../character/character.interface'

interface FighterDTO {
  id: string
  name: string
  health: number
  attack: number
  magic: number
  defense: number
}

export default interface AssaultLogDTO {
  turn: number
  assailant: FighterDTO
  assailed: FighterDTO
  assaultResult: {
    attack: number
    damageTaken: number
  }
}
