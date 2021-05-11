import AssaultLog from '../../../game/game-logger/AssaultLog'
import { RandomInterface } from '../../../game/services/RandomInterface'
import Fighter from '../Fighter'

export default interface BattleRunnerInterface {
  run(
    fighterOfPlayer: Fighter,
    opponent: Fighter,
    onLogCreatedCallback: (assaultLog: AssaultLog) => void,
    randomService: RandomInterface
  ): Fighter
}
