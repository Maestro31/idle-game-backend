import { QueryTypes } from 'sequelize'
import { RandomInterface } from '../../../../shared/services/RandomInterface'
import sequelize from '../../../../sequelize'
import DateProviderInterface from '../../../../shared/services/DateProviderInterface'
import NoOpponentFoundException from '../../exceptions/NoOpponentFoundException'
import Fighter from '../../Fighter'
import FighterMapper from '../../mappers/FighterMapper'
import OpponentSelectorInterface from '../../services/OpponentSelectorInterface'

export default class RealOpponentSelector implements OpponentSelectorInterface {
  constructor(
    private randomService: RandomInterface,
    private dateProvider: DateProviderInterface
  ) {}

  async to(fighter: Fighter): Promise<Fighter> {
    const battleCountByCharacterQuery = `
      (SELECT c.id, COUNT(b.id) AS battleCount FROM Character AS c
      LEFT OUTER JOIN BattleResult AS b ON b.winnerID = c.id or b.looserID = c.id
      GROUP BY c.id)`

    const results = await sequelize.query(
      `
      SELECT *, battleCount FROM Character
      INNER JOIN ${battleCountByCharacterQuery} AS withBattleCount
      ON withBattleCount.id = Character.id
      WHERE battleCount = (SELECT MIN(battleCount) FROM ${battleCountByCharacterQuery})
      AND ABS(rank - ?) = (SELECT MIN(ABS(rank - ?)) FROM Character)
      AND NOT ownerID = ?
      AND datetime(recoveredAt) < datetime(?)
      ORDER BY createdAt ASC`,
      {
        replacements: [
          fighter.rank,
          fighter.rank,
          fighter.ownerID,
          this.dateProvider.now(),
        ],
        type: QueryTypes.SELECT,
      }
    )

    if (results.length === 0) {
      throw new NoOpponentFoundException()
    }

    const index = this.randomService.getValueUntil(results.length - 1) - 1
    console.log(index)
    return FighterMapper.toDomain(results[index])
  }
}
