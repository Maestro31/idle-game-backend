import Fighter from '../Fighter'

export default interface OpponentSelectorInterface {
  to(fighter: Fighter): Promise<Fighter>
}
