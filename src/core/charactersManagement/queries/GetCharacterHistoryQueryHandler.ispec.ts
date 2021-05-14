import { BattleResultDAO, CharacterDAO } from '../../../sequelize/models'
import DateProviderStub from '../../../services/DateProviderStub'
import UniqueIdAdapter from '../../../services/UniqueIdAdapter'
import GetCharacterHistoryQueryHandler from './GetCharacterHistoryQueryHandler'

describe('Get Character History', () => {
  let getCharacterHistory: GetCharacterHistoryQueryHandler
  const uniqueIdAdapter = new UniqueIdAdapter()
  const dateProvider = new DateProviderStub()
  dateProvider.willRespond(new Date('2021-05-14 15:00:00'))
  const opponent = {
    id: 'uuid-opponent-1',
    name: 'Jack',
    skillPoints: 0,
    rank: 0,
    health: 13,
    attack: 3,
    magic: 3,
    defense: 3,
    recoveredAt: dateProvider.now(),
    ownerID: 'uuid-owner-1',
    status: 'living',
  }

  const character = {
    id: 'uuid-character-1',
    name: 'John',
    skillPoints: 0,
    rank: 0,
    health: 13,
    attack: 3,
    magic: 3,
    defense: 3,
    recoveredAt: dateProvider.now(),
    ownerID: 'uuid-owner-2',
  }

  beforeEach(async () => {
    getCharacterHistory = new GetCharacterHistoryQueryHandler()
    await CharacterDAO.create(opponent)
    await CharacterDAO.create(character)
  })

  afterEach(async () => {
    await CharacterDAO.destroy({ truncate: true })
    await BattleResultDAO.destroy({ truncate: true })
  })

  it('should return character history with empty battle history', async () => {
    const results = await getCharacterHistory.execute({
      characterID: character.id,
    })
    expect(results).toEqual([])
  })

  it('should return one battle history', async () => {
    await createBattleHistory('won')
    const results = await getCharacterHistory.execute({
      characterID: character.id,
    })

    expect(results).toHaveLength(1)
  })

  it('should return multiple battle histories', async () => {
    await createBattleHistory('won')
    await createBattleHistory('won')

    const results = await getCharacterHistory.execute({
      characterID: character.id,
    })
    expect(results).toHaveLength(2)
  })

  it('should return battle history as won', async () => {
    await createBattleHistory('won')

    const results = await getCharacterHistory.execute({
      characterID: character.id,
    })
    expect(results[0]).toEqual({
      opponent,
      status: 'won',
    })
  })

  it('should return battle history as lost', async () => {
    await createBattleHistory('lost')

    const results = await getCharacterHistory.execute({
      characterID: character.id,
    })
    expect(results[0]).toEqual({
      opponent,
      status: 'lost',
    })
  })

  it('should return battle history as draw', async () => {
    await createBattleHistory('draw')

    const results = await getCharacterHistory.execute({
      characterID: character.id,
    })
    expect(results[0]).toEqual({
      opponent,
      status: 'draw',
    })
  })

  async function createBattleHistory(
    status: 'won' | 'lost' | 'draw'
  ): Promise<void> {
    const battleResultProps: any = {
      id: uniqueIdAdapter.generate(),
    }

    switch (status) {
      case 'won':
        battleResultProps.winnerID = character.id
        battleResultProps.looserID = opponent.id
        battleResultProps.draw = false
        break
      case 'lost':
        battleResultProps.winnerID = opponent.id
        battleResultProps.looserID = character.id
        battleResultProps.draw = false
        break
      case 'draw':
        battleResultProps.winnerID = character.id
        battleResultProps.looserID = opponent.id
        battleResultProps.draw = true
    }

    await BattleResultDAO.create(battleResultProps)
  }
})
