import sequelize from '../../../../sequelize'
import { BattleResultDAO, BattleLogDAO } from '../../../../sequelize/models'
import Battle from '../../Battle'
import Fighter from '../../Fighter'
import BattleRepositoryInterface from '../../repositories/BattleRepositoryInterface'
import FighterRepositoryInterface from '../../repositories/FighterRepositoryInterface'

export default class SequelizeBattleRepository
  implements BattleRepositoryInterface
{
  constructor(private fighterRepository: FighterRepositoryInterface) {}

  async findFighter(characterID: string): Promise<Fighter | null> {
    return this.fighterRepository.findById(characterID)
  }

  async save(battle: Battle): Promise<void> {
    const transaction = await sequelize.transaction()

    try {
      this.fighterRepository.save(battle.winner)
      this.fighterRepository.save(battle.looser)
      await BattleResultDAO.create({
        id: battle.id,
        winnerID: battle.winner.id,
        looserID: battle.looser.id,
      })

      battle.logs.map((log) =>
        BattleLogDAO.create({ battleResultID: battle.id, log })
      )

      await transaction.commit()
    } catch {
      await transaction.rollback()
    }
  }

  findAll(): Promise<Battle[]> {
    throw new Error('Method not implemented.')
  }

  async findById(id: string): Promise<Battle | null> {
    throw new Error('Method not implemented.')
  }

  async exists(battl: Battle): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
}
