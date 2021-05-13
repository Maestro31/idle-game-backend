import AssaultLog from '../../../game/game-logger/AssaultLog'
import Fighter from '../Fighter'

export default interface BattleRunnerInterface {
  run(
    fighterOfPlayer: Fighter,
    opponent: Fighter,
    onLogCreatedCallback: (assaultLog: AssaultLog) => void
  ): Fighter
}
