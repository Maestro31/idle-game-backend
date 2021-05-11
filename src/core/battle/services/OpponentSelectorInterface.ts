import Fighter from '../Fighter'

export default interface OpponentSelectorInterface {
  selectOpponentFor(fighter: Fighter): Promise<Fighter>
}
