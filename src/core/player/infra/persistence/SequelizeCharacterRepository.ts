import { Op } from 'sequelize'
import { CharacterDAO } from '../../../../infra/persistence/sequelize/models'
import Character from '../../Character'
import CharacterMapper from '../../mappers/CharacterMapper'
import CharacterRepositoryInterface from '../../repositories/CharacterRepositoryInterface'

export default class SequelizeCharacterRepository
  implements CharacterRepositoryInterface {
  async save(character: Character): Promise<void> {
    const exists = await this.exists(character)
    const characterDao = CharacterMapper.toPersistence(character)
    if (!exists) await CharacterDAO.create(characterDao)
    else
      await CharacterDAO.update(characterDao, {
        where: { id: character.id },
      })
  }
  async findAll(): Promise<Character[]> {
    throw new Error('Not implemented Error')
  }

  async findById(id: string): Promise<Character | null> {
    const characterDao = await CharacterDAO.findByPk(id)
    if (!characterDao) return null
    return CharacterMapper.toDomain(characterDao)
  }
  async exists(character: Character): Promise<boolean> {
    return (await CharacterDAO.findByPk(character.id)) !== null
  }
}
