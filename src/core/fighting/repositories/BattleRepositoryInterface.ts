import Repository from '../../../shared/infra/persistence/repository/Repository'
import Fighter from '../Fighter'
import Battle from '../Battle'

export default interface BattleRepositoryInterface extends Repository<Battle> {
  findFighter(characterID: string): Promise<Fighter | null>
}
