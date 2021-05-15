import FighterNotFoundException from '../exceptions/FighterNotFoundException'
import InMemoryBattleRepository from '../infra/persistence/InMemoryBattleRepository'
import InMemoryFighterRepository from '../infra/persistence/InMemoryFighterRepository'
import CreateBattleCommandHandler from './CreateBattleCommandHandler'
import UniqueIdAdapterStub from '../../../services/UniqueIdAdaperStub'
import InMemoryCharacterRepository from '../../charactersManagement/infra/persistence/InMemoryCharacterRepository'
import FighterBuilder from '../builders/FighterBuilder'
import DateProviderStub from '../../../services/DateProviderStub'
import NotReadyFighterException from '../exceptions/NotReadyFighterException'
import OpponentSelectorStub from '../infra/services/OpponentSelectorStub'
import Fighter from '../Fighter'
import RandomStub from '../../../services/RandomStub'

describe('Create Battle', () => {
  let createBattle: CreateBattleCommandHandler
  let characterRepository: InMemoryCharacterRepository
  let fighterRepository: InMemoryFighterRepository
  let battleRepository: InMemoryBattleRepository
  let uniqueIdAdapter: UniqueIdAdapterStub
  let dateProvider: DateProviderStub
  let opponentSelector: OpponentSelectorStub
  let randomService: RandomStub

  beforeEach(() => {
    fighterRepository = new InMemoryFighterRepository()
    characterRepository = new InMemoryCharacterRepository()
    dateProvider = new DateProviderStub()
    opponentSelector = new OpponentSelectorStub()
    randomService = new RandomStub()
    battleRepository = new InMemoryBattleRepository(
      fighterRepository,
      characterRepository
    )
    uniqueIdAdapter = new UniqueIdAdapterStub()
    createBattle = new CreateBattleCommandHandler(
      battleRepository,
      uniqueIdAdapter,
      opponentSelector,
      randomService,
      dateProvider
    )

    randomService.willRespond(5)
  })

  describe('Validation', () => {
    it('should throwing an error if the fighter does not exists', async () => {
      await expect(
        createBattle.execute({ characterID: 'uuid-character-1' })
      ).rejects.toThrowError(FighterNotFoundException)
    })

    it('should throwing an error if the player of fighter have a recovered time cooldown', async () => {
      dateProvider.willRespond(new Date('2021-05-10 20:59:59'))
      const fighter = new FighterBuilder('uuid-character-1')
        .withProps({ recoveredAt: new Date('2021-05-10 21:00:00') })
        .build()

      fighterRepository.feed([fighter])

      await expect(
        createBattle.execute({ characterID: 'uuid-character-1' })
      ).rejects.toThrowError(NotReadyFighterException)
    })

    it('should throwing an error if the opponent fighter have a recovered time cooldown', async () => {
      dateProvider.willRespond(new Date('2021-05-10 22:00:00'))
      const fighter = new FighterBuilder('uuid-character-1')
        .withProps({ recoveredAt: new Date('2021-05-10 21:00:00') })
        .build()

      const opponent = new FighterBuilder('uuid-character-2')
        .withProps({ recoveredAt: new Date('2021-05-10 22:59:59') })
        .build()

      opponentSelector.willSelect(opponent)
      fighterRepository.feed([fighter])

      await expect(
        createBattle.execute({ characterID: 'uuid-character-1' })
      ).rejects.toThrowError(NotReadyFighterException)
    })

    it('should create a battle', async () => {
      dateProvider.willRespond(new Date('2021-05-10 21:00:00'))
      const fighter = new FighterBuilder('uuid-character-1')
        .withProps({ recoveredAt: new Date('2021-05-10 20:59:59') })
        .build()

      fighterRepository.feed([fighter])

      const opponent = new FighterBuilder('uuid-character-2')
        .withProps({ recoveredAt: new Date('2021-05-10 20:59:59') })
        .build()

      opponentSelector.willSelect(opponent)

      await createBattle.execute({ characterID: 'uuid-character-1' })
      const battle = (await battleRepository.findAll())[0]
      expect(battle.fighterOfPlayer).toBe(fighter)
      expect(battle.opponent).toBe(opponent)
    })

    it('should declare a match a draw', async () => {
      const fighter = new FighterBuilder('uuid-character-1')
        .withProps({
          attack: 2,
          defense: 3,
          recoveredAt: new Date('2021-05-10 21:00:00'),
        })
        .build()

      fighterRepository.feed([fighter])

      const opponent = new FighterBuilder('uuid-character-2')
        .withProps({
          attack: 2,
          defense: 3,
          recoveredAt: new Date('2021-05-10 21:00:00'),
        })
        .build()

      opponentSelector.willSelect(opponent)
      const battle = await createBattle.execute({
        characterID: 'uuid-character-1',
      })
      expect(battle.draw).toBe(true)
    })
  })

  describe('Battle ending', () => {
    let characterID: string
    let fighterOfPlayer: Fighter
    let opponent: Fighter

    beforeEach(() => {
      characterID = 'uuid-character-1'
      prepareBattle(characterID)
    })

    it('should apply a recovery time cool down for the fighter of player after the battle', async () => {
      await createBattle.execute({ characterID })
      expect(fighterOfPlayer.recoveredAt).toEqual(
        new Date('2021-05-10 22:00:00')
      )
    })

    it('should apply a recovery time cool down for the opponent after the battle', async () => {
      await createBattle.execute({ characterID })
      expect(opponent.recoveredAt).toEqual(new Date('2021-05-10 22:00:00'))
    })

    it('should declare the winner', async () => {
      const battle = await createBattle.execute({ characterID })
      expect(battle.winner.id).toBe(fighterOfPlayer.id)
    })

    it('should declare the looser', async () => {
      const battle = await createBattle.execute({ characterID })
      expect(battle.looser.id).toBe(opponent.id)
    })

    it('should giving a reward to the winner incrementing the rank and skill points', async () => {
      await createBattle.execute({ characterID })

      expect(fighterOfPlayer.toPrimitives()).toEqual({
        id: 'uuid-character-1',
        name: 'John',
        health: 13,
        attack: 5,
        defense: 2,
        magic: 3,
        skillPoints: 1,
        rank: 4,
        recoveredAt: new Date('2021-05-10 22:00:00'),
      })
    })

    describe('Logging', () => {
      it('should provide logs for each turn', async () => {
        await createBattle.execute({ characterID })
        const battle = (await battleRepository.findAll())[0]
        expect(battle.logs).toHaveLength(5)
        expect(battle.logs[0]).toEqual({
          turn: 1,
          assailant: {
            id: characterID,
            name: 'John',
            health: 13,
            attack: 5,
            magic: 3,
            defense: 2,
            rank: 3,
            skillPoints: 0,
            recoveredAt: new Date('2021-05-10 19:00:00'),
          },
          assailed: {
            id: 'uuid-character-2',
            name: 'Jack',
            health: 8,
            attack: 3,
            magic: 1,
            defense: 1,
            rank: 3,
            skillPoints: 0,
            recoveredAt: new Date('2021-05-10 19:00:00'),
          },
          assaultResult: {
            attack: 6,
            damageTaken: 5,
          },
        })
      })
    })

    function prepareBattle(id: string) {
      fighterOfPlayer = new FighterBuilder(id)
        .withProps({
          recoveredAt: new Date('2021-05-10 19:00:00'),
          attack: 5,
          magic: 3,
          defense: 2,
        })
        .build()

      opponent = new FighterBuilder('uuid-character-2')
        .withProps({
          recoveredAt: new Date('2021-05-10 19:00:00'),
          attack: 3,
          magic: 1,
          defense: 1,
          name: 'Jack',
        })
        .build()

      fighterRepository.feed([fighterOfPlayer])
      opponentSelector.willSelect(opponent)
      dateProvider.willRespond(new Date('2021-05-10 21:00:00'))
    }
  })
})
