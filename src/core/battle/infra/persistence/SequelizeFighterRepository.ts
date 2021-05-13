import { CharacterDAO } from '../../../../infra/persistence/sequelize/models'
import Fighter from '../../Fighter'
import FighterMapper from '../../mappers/FighterMapper'
import FighterRepositoryInterface from '../../repositories/FighterRepositoryInterface'

export default class SequelizeFighterRepository
  implements FighterRepositoryInterface
{
  async save(fighter: Fighter): Promise<void> {
    CharacterDAO.update(FighterMapper.toPersistence(fighter), {
      where: { id: fighter.id },
    })
  }

  findAll(): Promise<Fighter[]> {
    throw new Error('Method not implemented.')
  }

  async findById(id: string): Promise<Fighter | null> {
    return FighterMapper.toDomain(CharacterDAO.findByPk(id))
  }

  async exists(fighter: Fighter): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
}
