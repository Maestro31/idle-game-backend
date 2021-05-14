import CharacterCreator, { CharacterProps } from '../character/CharacterCreator'
import { Fighter } from '../fighter/Fighter'
import AssaultLog from '../game-logger/AssaultLog'
import { RandomInterface } from '../../shared/services/RandomInterface'
import { IllegalFightError } from './IllegalFightException'

export default class Arena {
  private isEndFight = false
  private turnCount = 0

  private onFightEndedCallback:
    | ((winnerId: string, winnerProps: CharacterProps) => void)
    | null = null
  private onAssaultLogCreatedCallback:
    | ((assaultLog: AssaultLog) => void)
    | null = null

  constructor(
    private assailantFighter: Fighter,
    private assailedFighter: Fighter,
    private randomService: RandomInterface
  ) {}

  getAssailantFighter(): Fighter {
    return this.assailantFighter
  }

  getAssailedFighter(): Fighter {
    return this.assailedFighter
  }

  nextTurn(): void {
    const assailantFighter = this.assailantFighter
    this.assailantFighter = this.assailedFighter
    this.assailedFighter = assailantFighter
  }

  startAssault(): void {
    this.guardIllegalFight()

    this.turnCount += 1

    const assailantAttack = this.assailantFighter.getAttack()
    const attackToInflict =
      this.randomService.getValueUntil(assailantAttack) + 1

    const previousAssailedHealth = this.assailedFighter.getRemainingHealth()

    this.assailantFighter.attemptToInflictDamage(
      attackToInflict,
      this.assailedFighter
    )

    this.logAssault(
      attackToInflict,
      previousAssailedHealth - this.assailedFighter.getRemainingHealth()
    )

    this.checkEndCondition()
  }

  onFightEnded(
    onFightEndedCallback: (
      winnerId: string,
      winnerProps: CharacterProps
    ) => void
  ) {
    this.onFightEndedCallback = onFightEndedCallback
  }

  onAssaultLogCreated(
    onAssaultLogCreatedCallback: (assaultLog: AssaultLog) => void
  ) {
    this.onAssaultLogCreatedCallback = onAssaultLogCreatedCallback
  }

  private isAssailedFighterDead(): boolean {
    return this.assailedFighter.getRemainingHealth() <= 0
  }

  private logAssault(attackToInflict: number, damageTaken: number): void {
    if (!this.onAssaultLogCreatedCallback) return

    this.onAssaultLogCreatedCallback({
      turn: this.turnCount,
      assailant: {
        id: this.assailantFighter.id,
        ...this.assailantFighter.getCharacterProps(),
        health: this.assailantFighter.getRemainingHealth(),
      },
      assailed: {
        id: this.assailedFighter.id,
        ...this.assailedFighter.getCharacterProps(),
        health: this.assailedFighter.getRemainingHealth(),
      },
      assaultResult: {
        attack: attackToInflict,
        damageTaken,
      },
    })
  }

  private guardIllegalFight() {
    if (this.isEndFight) {
      throw new IllegalFightError()
    }
  }

  private checkEndCondition() {
    if (this.isAssailedFighterDead()) {
      this.isEndFight = true
      const rewardedWinnerProps = new CharacterCreator().giveReward(
        this.assailantFighter.getCharacterProps()
      )

      this.notifyForWinner(this.assailantFighter.id, rewardedWinnerProps)
    }
  }

  private notifyForWinner(winnerId: string, winnerProps: CharacterProps) {
    if (!this.onFightEndedCallback) return
    this.onFightEndedCallback(winnerId, winnerProps)
  }
}
