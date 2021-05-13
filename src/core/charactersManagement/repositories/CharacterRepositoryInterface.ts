import Repository from '../../../shared/infra/persistence/repository/Repository'
import Character from '../Character'

export default interface CharacterRepositoryInterface
  extends Repository<Character> {}
