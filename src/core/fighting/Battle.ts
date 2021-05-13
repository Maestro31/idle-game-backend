import AssaultLogDTO from '../../game/game-logger/AssaultLog'
import DateProviderInterface from '../../shared/services/DateProviderInterface'
import NotReadyFighterException from './exceptions/NotReadyFighterException'
import Fighter from './Fighter'
import BattleRunnerInterface from './services/BattleRunnerInterface'

export default class Battle {
  private _winner!: Fighter
  private _looser!: Fighter
  private _logs: AssaultLogDTO[] = []
  private _draw: boolean = false

  constructor(
    readonly id: string,
    private _fighterOfPlayer: Fighter,
    private _opponent: Fighter,
    private dateProvider: DateProviderInterface
  ) {
    this.guardFighterIsNotReady(this._fighterOfPlayer)
    this.guardFighterIsNotReady(this._opponent)
  }

  get draw(): boolean {
    return this._draw
  }

  get winner(): Fighter {
    return this._winner
  }

  get looser(): Fighter {
    return this._looser
  }

  run(battleRunner: BattleRunnerInterface) {
    if (this.noOneFighterCanWin()) {
      this._draw = true
      this._winner = this.fighterOfPlayer
      this._looser = this.opponent
      return
    }

    const winner = battleRunner.run(
      this._fighterOfPlayer,
      this.opponent,
      this.onAssaultLogCreated
    )

    this.applyRecoveryCoolDown(this._fighterOfPlayer)
    this.applyRecoveryCoolDown(this.opponent)

    if (winner.id === this._fighterOfPlayer.id) {
      this._winner = this._fighterOfPlayer
      this._looser = this._opponent
    } else {
      this._winner = this._opponent
      this._looser = this._fighterOfPlayer
    }
  }

  get fighterOfPlayer(): Fighter {
    return this._fighterOfPlayer
  }

  get opponent(): Fighter {
    return this._opponent
  }

  get logs(): AssaultLogDTO[] {
    return this._logs
  }

  private guardFighterIsNotReady(fighter: Fighter) {
    if (fighter.recoveredAt > this.dateProvider.now()) {
      throw new NotReadyFighterException()
    }
  }

  private onAssaultLogCreated = (assaultLog: AssaultLogDTO) => {
    this._logs.push(assaultLog)
  }

  private applyRecoveryCoolDown(fighter: Fighter): void {
    fighter.recoveredAt = new Date(
      this.dateProvider.now().getTime() + 60 * 60 * 1000
    )
  }

  private noOneFighterCanWin() {
    return (
      !this.fighterOfPlayer.canWin(this.opponent) &&
      !this.opponent.canWin(this.fighterOfPlayer)
    )
  }
}
