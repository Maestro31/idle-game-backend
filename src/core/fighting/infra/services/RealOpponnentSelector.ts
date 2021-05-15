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
    const minimalRankAvailableQuery = `
      (
        SELECT MIN(ABS(rank - ${fighter.rank})) FROM Character
        WHERE NOT ownerID = '${fighter.ownerID}'
        AND NOT status = 'deleted'
        AND datetime(recoveredAt) <= datetime('${this.dateProvider
          .now()
          .toISOString()}')
      )
    `
    const charactersWithBattleCountQuery = `
      (SELECT *, battleCount FROM Character
        LEFT OUTER JOIN
        (SELECT c.id, COUNT(b.id) AS battleCount FROM Character AS c
        LEFT OUTER JOIN BattleResult AS b ON b.winnerID = c.id or b.looserID = c.id
        GROUP BY c.id) AS withBattleCount
        ON withBattleCount.id = Character.id
        WHERE ABS(rank - ${fighter.rank}) = ${minimalRankAvailableQuery}
        AND NOT ownerID = '${fighter.ownerID}'
        AND NOT status = 'deleted'
        AND datetime(recoveredAt) <= datetime('${this.dateProvider
          .now()
          .toISOString()}')
        ORDER BY createdAt ASC)`

    const results = await sequelize.query(
      `SELECT * FROM ${charactersWithBattleCountQuery}
      WHERE battleCount = (SELECT MIN(battleCount) FROM ${charactersWithBattleCountQuery})`,
      {
        type: QueryTypes.SELECT,
      }
    )

    if (results.length === 0) {
      throw new NoOpponentFoundException()
    }

    const index = this.randomService.getValueUntil(results.length - 1)
    return FighterMapper.toDomain(results[index])
  }
}
