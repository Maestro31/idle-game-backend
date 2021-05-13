import { CharacterDAO, PlayerDAO } from '../../../../sequelize/models'
import PlayerMapper from '../../mappers/PlayerMapper'
import Player from '../../Player'
import PlayerRepositoryInterface from '../../repositories/PlayerRepositoryInterface'
import sequelize from '../../../../sequelize'
import CharacterRepositoryInterface from '../../repositories/CharacterRepositoryInterface'

export default class SequelizePlayerRepository
  implements PlayerRepositoryInterface
{
  constructor(private characterRepository: CharacterRepositoryInterface) {}

  async findAll(): Promise<Player[]> {
    throw new Error('Method not implemented.')
  }

  async exists(player: Player): Promise<boolean> {
    return (await PlayerDAO.findOne({ where: { userID: player.id } })) !== null
  }

  async findById(id: string): Promise<Player | null> {
    const playerDao = await PlayerDAO.findOne({
      where: { userID: id },
      include: {
        model: CharacterDAO,
        as: 'characters',
      },
    })
    if (!playerDao) return null
    return PlayerMapper.toDomain(playerDao)
  }

  async save(player: Player): Promise<void> {
    const exists = await this.exists(player)
    const rawPlayer = PlayerMapper.toPersistence(player)

    const transaction = await sequelize.transaction()

    try {
      player.characters.map((character) =>
        this.characterRepository.save(character)
      )

      if (!exists) await PlayerDAO.create(rawPlayer)
      else
        await PlayerDAO.update(rawPlayer, {
          where: { userID: player.id },
        })

      await transaction.commit()
    } catch {
      await transaction.rollback()
    }
  }
}
