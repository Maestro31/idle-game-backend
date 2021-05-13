import { CharacterDAO } from '../../../../sequelize/models'
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
    const character = await CharacterDAO.findByPk(id)
    if (!character) return null
    return FighterMapper.toDomain(character)
  }

  async exists(fighter: Fighter): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
}
