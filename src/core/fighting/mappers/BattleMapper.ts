import AssaultLogDTO from '../../../game/game-logger/AssaultLog'
import Battle from '../Battle'
import { FighterProps } from '../Fighter'

export interface BattleDTO {
  winner: FighterProps
  looser: FighterProps
  logs: AssaultLogDTO[]
  draw: boolean
}

export default class BattleMapper {
  static toDTO(battle: Battle): BattleDTO {
    return {
      winner: battle.winner.toPrimitives(),
      looser: battle.looser.toPrimitives(),
      logs: battle.logs,
      draw: battle.draw,
    }
  }
}
