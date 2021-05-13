import Fighter from '../../Fighter'
import CharacterRepositoryInterface from '../../../charactersManagement/repositories/CharacterRepositoryInterface'
import Battle from '../../Battle'
import BattleRepositoryInterface from '../../repositories/BattleRepositoryInterface'
import FighterRepositoryInterface from '../../repositories/FighterRepositoryInterface'

export default class InMemoryBattleRepository
  implements BattleRepositoryInterface
{
  constructor(
    private fighterRepository: FighterRepositoryInterface,
    private characterRepository: CharacterRepositoryInterface
  ) {}

  private battles: Battle[] = []

  async findAll(): Promise<Battle[]> {
    return this.battles
  }

  async exists(battle: Battle): Promise<boolean> {
    return (await this.findById(battle.id)) !== null
  }

  async findById(id: string): Promise<Battle | null> {
    const foundBattle = this.battles.find((battle) => battle.id === id)
    if (foundBattle == null) return null
    return foundBattle
  }

  async save(battle: Battle): Promise<void> {
    if (await this.exists(battle))
      this.battles = this.battles.map((f) => (f.id === battle.id ? battle : f))
    else this.battles.push(battle)
  }

  async findFighter(characterID: string): Promise<Fighter | null> {
    const fighter = await this.fighterRepository.findById(characterID)
    if (!fighter) return null
    return fighter
  }

  feed(battles: Battle[]) {
    this.battles = battles
  }
}
