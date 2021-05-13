import RandomStub from '../../../../game/services/RandomStub'
import {
  BattleResultDAO,
  CharacterDAO,
} from '../../../../infra/persistence/sequelize/models'
import DateProviderStub from '../../../../services/DateProviderStub'
import UniqueIdAdapter from '../../../../services/UniqueIdAdapter'
import Character from '../../../player/Character'
import CharacterMapper from '../../../player/mappers/CharacterMapper'
import FighterBuilder from '../../builders/FighterBuilder'
import NoOpponentFoundException from '../../exceptions/NoOpponentFoundException'
import Fighter from '../../Fighter'
import RealOpponentSelector from './RealOpponnentSelector'

describe('Opponent Selector', () => {
  let opponentSelector: RealOpponentSelector
  let fighter: Fighter
  let uniqueIdAdapter: UniqueIdAdapter
  let randomService: RandomStub
  let dateProvider: DateProviderStub

  beforeEach(() => {
    dateProvider = new DateProviderStub()
    dateProvider.willRespond(new Date('2021-05-13 10:59:59'))
    randomService = new RandomStub()
    opponentSelector = new RealOpponentSelector(randomService, dateProvider)
    uniqueIdAdapter = new UniqueIdAdapter()
    fighter = new FighterBuilder('uuid-character-1')
      .withProps({ rank: 10, ownerID: 'uuid-player-1' })
      .build()
  })

  afterEach(async () => {
    await CharacterDAO.destroy({ truncate: true })
    await BattleResultDAO.destroy({ truncate: true })
  })

  it('should retrieve the only fighter that exists', async () => {
    const expectedId = await createCharacterWithProps({ rank: 0 })
    expect((await opponentSelector.to(fighter)).id).toBe(expectedId)
  })

  it('should retrieve the character with the same rank', async () => {
    await createCharacterWithProps({ rank: 9 })
    const expectedId = await createCharacterWithProps({ rank: 10 })
    expect((await opponentSelector.to(fighter)).id).toBe(expectedId)
  })

  it('should retrieve the character with the closest rank', async () => {
    await createCharacterWithProps({ rank: 8 })
    const expectedId = await createCharacterWithProps({ rank: 11 })
    expect((await opponentSelector.to(fighter)).id).toBe(expectedId)
  })

  it('should retrieve the character with the closest rank and the least amount of combat', async () => {
    await createCharacterWithProps({ rank: 8 })
    const expectedId = await createCharacterWithProps({ rank: 11 })
    const id1 = await createCharacterWithProps({ rank: 11 })
    const id2 = await createCharacterWithProps({ rank: 11 })

    await BattleResultDAO.create({
      winnerID: id1,
      looserID: uniqueIdAdapter.generate(),
    })
    await BattleResultDAO.create({
      winnerID: uniqueIdAdapter.generate(),
      looserID: id1,
    })
    await BattleResultDAO.create({
      winnerID: uniqueIdAdapter.generate(),
      looserID: id2,
    })

    expect((await opponentSelector.to(fighter)).id).toBe(expectedId)
  })

  it('should retrieve a random character when several match', async () => {
    randomService.willRespond(2)
    await createCharacterWithProps({ rank: 11 })
    await createCharacterWithProps({ rank: 11 })
    const expectedId = await createCharacterWithProps({ rank: 11 })

    expect((await opponentSelector.to(fighter)).id).toBe(expectedId)
  })

  it('should not retrieve a character with the same owner that the fighter', async () => {
    await createCharacterWithProps({ rank: 10, ownerID: 'uuid-player-1' })
    const expectedId = await createCharacterWithProps({
      rank: 10,
      ownerID: 'uuid-player-2',
    })

    expect((await opponentSelector.to(fighter)).id).toBe(expectedId)
  })

  it('should throwing an error if no one character is available', async () => {
    await expect(opponentSelector.to(fighter)).rejects.toThrowError(
      NoOpponentFoundException
    )
  })

  it('should not retrieve a character who have a recovered time cooldown', async () => {
    await createCharacterWithProps({
      rank: 10,
      recoveredAt: new Date('2021-05-13 11:00:00'),
    })

    await expect(opponentSelector.to(fighter)).rejects.toThrowError(
      NoOpponentFoundException
    )
  })

  async function createCharacterWithProps({
    rank,
    ownerID = 'uuid-player-2',
    recoveredAt = new Date('2021-05-13 10:00:00'),
  }: {
    rank: number
    ownerID?: string
    recoveredAt?: Date
  }): Promise<string> {
    const id = uniqueIdAdapter.generate()
    const character = Character.fromPrimitives({
      id: id,
      name: 'John',
      skillPoints: 0,
      rank,
      attack: 0,
      magic: 0,
      health: 0,
      defense: 0,
      recoveredAt,
      ownerID,
    })

    await CharacterDAO.create({
      ...CharacterMapper.toPersistence(character),
    })

    return id
  }
})
