import Fighter from '../../Fighter'
import FighterRepositoryInterface from '../../repositories/FighterRepositoryInterface'

export default class InMemoryFighterRepository
  implements FighterRepositoryInterface {
  private fighters: Fighter[] = []

  async findAll(): Promise<Fighter[]> {
    return this.fighters
  }

  async exists(fighter: Fighter): Promise<boolean> {
    return (await this.findById(fighter.id)) !== null
  }

  async findById(id: string): Promise<Fighter | null> {
    const foundFighter = this.fighters.find((fighter) => fighter.id === id)
    if (foundFighter == null) return null
    return foundFighter
  }

  async save(fighter: Fighter): Promise<void> {
    if (await this.exists(fighter))
      this.fighters = this.fighters.map((f) =>
        f.id === fighter.id ? fighter : f
      )
    else this.fighters.push(fighter)
  }

  feed(fighters: Fighter[]) {
    this.fighters = fighters
  }
}
