import Arena from '../../../../game/arena/Arena'
import Fighter from '../../Fighter'
import { Fighter as ArenaFighter } from '../../../../game/fighter/Fighter'
import BattleRunnerInterface from '../../services/BattleRunnerInterface'
import { RandomInterface } from '../../../../shared/services/RandomInterface'
import AssaultLog from '../../../../game/game-logger/AssaultLog'
import GameLoggerInterface from '../../../../game/game-logger/GameLoggerInterface'
import ConsoleGameLogger from '../../../../game/game-logger/ConsoleGameLogger'

export default class BattleRunner implements BattleRunnerInterface {
  private logger: GameLoggerInterface = new ConsoleGameLogger()
  constructor(private randomService: RandomInterface) {}

  run(
    fighterOfPlayer: Fighter,
    opponent: Fighter,
    onLogCreatedCallback: (assaultLog: AssaultLog) => void
  ): Fighter {
    const arena = this.prepareArena(fighterOfPlayer, opponent)
    let winner = null
    arena.onFightEnded((winnerId: string) => {
      winner = winnerId === fighterOfPlayer.id ? fighterOfPlayer : opponent
    })

    arena.onAssaultLogCreated(onLogCreatedCallback)

    while (!winner) {
      arena.startAssault()
      arena.nextTurn()
    }

    this.giveReward(winner)
    return winner
  }

  private prepareArena(fighterOfPlayer: Fighter, opponent: Fighter): Arena {
    const { id, ...fighterOfPlayerProps } = fighterOfPlayer.toPrimitives()
    const assailantFighter = new ArenaFighter(id, fighterOfPlayerProps)
    const { id: opponentId, ...opponentProps } = opponent.toPrimitives()
    const opponentFighter = new ArenaFighter(opponentId, opponentProps)
    return new Arena(assailantFighter, opponentFighter, this.randomService)
  }

  private giveReward(winner: Fighter): void {
    winner.incrementRank()
    winner.incrementSkillPoints()
  }
}
