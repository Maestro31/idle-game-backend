import Fighter from '../../Fighter'
import OpponentSelectorInterface from '../../services/OpponentSelectorInterface'

export default class OpponentSelectorStub implements OpponentSelectorInterface {
  private opponent!: Fighter

  async to(fighter: Fighter): Promise<Fighter> {
    return this.opponent
  }

  willSelect(opponent: Fighter): void {
    this.opponent = opponent
  }
}
