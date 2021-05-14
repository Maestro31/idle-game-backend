import QueryHandler from '../../../shared/domain/query/QueryHandler'
import { CharacterProps } from '../Character'
import { BattleResultDAO, CharacterDAO } from '../../../sequelize/models'
import { Op } from 'sequelize'
import CharacterMapper from '../mappers/CharacterMapper'

export interface GetCharacterHistoryQuery {
  characterID: string
}

export interface BattleHistoryDTO {
  opponent: CharacterProps
  status: 'won' | 'lost' | 'draw'
}

export default class GetCharacterHistoryQueryHandler
  implements
    QueryHandler<GetCharacterHistoryQuery, Promise<BattleHistoryDTO[]>>
{
  async execute({
    characterID,
  }: GetCharacterHistoryQuery): Promise<BattleHistoryDTO[]> {
    const battleResults = await BattleResultDAO.findAll({
      where: {
        [Op.or]: [{ winnerID: characterID }, { looserID: characterID }],
      },
      include: [
        { model: CharacterDAO, as: 'winner' },
        { model: CharacterDAO, as: 'looser' },
      ],
    })

    return battleResults.map((battleResult) =>
      this.battleResultToBattleHistoryDTO(characterID, battleResult)
    )
  }

  battleResultToBattleHistoryDTO(
    characterID: string,
    battleResult: any
  ): BattleHistoryDTO {
    return {
      opponent: this.opponentFor(characterID, battleResult),
      status: this.statusFor(characterID, battleResult),
    }
  }

  statusFor(characterID: string, battleResult: any) {
    return battleResult.draw
      ? 'draw'
      : battleResult.winner.id === characterID
      ? 'won'
      : 'lost'
  }

  opponentFor(characterID: string, battleResult: any) {
    const opponent =
      battleResult.winner.id === characterID
        ? battleResult.looser
        : battleResult.winner

    return CharacterMapper.toDomain(opponent).toPrimitives()
  }
}
