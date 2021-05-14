import UniqueIdAdapterStub from '../../../services/UniqueIdAdaperStub'
import InvalidArgumentsException from '../../../shared/domain/exceptions/InvalidArgumentException'
import CharacterLimitReachedException from '../exceptions/CharacterLimitReachedException'
import InvalidCharacterStateException from '../exceptions/InvalidCharacterStateException'
import InMemoryCharacterRepository from '../infra/persistence/InMemoryCharacterRepository'
import InMemoryPlayerRepository from '../infra/persistence/InMemoryPlayerRepository'
import Player from '../Player'
import CreateCharacterCommand from './CreateCharacterCommand'
import CreateCharacterCommandHandler from './CreateCharacterCommandHandler'

describe('Create Character Command', () => {
  let createCharacter: CreateCharacterCommandHandler
  let playerRepository: InMemoryPlayerRepository
  let characterRepository: InMemoryCharacterRepository
  let uniqueIdAdapter: UniqueIdAdapterStub

  beforeEach(() => {
    characterRepository = new InMemoryCharacterRepository()
    playerRepository = new InMemoryPlayerRepository(characterRepository)
    uniqueIdAdapter = new UniqueIdAdapterStub()
    createCharacter = new CreateCharacterCommandHandler(
      playerRepository,
      uniqueIdAdapter
    )
  })

  it('should throwing an error when the name is empty', async () => {
    const player = new Player('uuid-user-1', [])
    playerRepository.feed([player])

    await expect(
      createCharacter.execute(buildCommand({ name: '', userID: 'uuid-user-1' }))
    ).rejects.toThrowError('Field name could not be empty')
  })

  it('should create the character for the given informations', async () => {
    const player = new Player('uuid-user-1')
    playerRepository.feed([player])

    await createCharacter.execute(
      buildCommand({ name: 'Jack', userID: 'uuid-user-1' })
    )

    const character = player.getLivingCharacters()[0]
    expect(character.name).toBe('Jack')
    expect(character.ownerID).toBe('uuid-user-1')
  })

  it('should not create an eleventh character and throwing an error', async () => {
    const player = new Player('uuid-user-1')
    playerRepository.feed([player])

    const { skillPoints, attack, health, magic, defense } = buildCommand()
    for (let i = 0; i < 10; i++) {
      player.addCharacter(
        `uuid-character-${i}`,
        `Name-${i}`,
        skillPoints,
        health,
        attack,
        magic,
        defense
      )
    }

    await expect(
      createCharacter.execute(
        buildCommand({ name: 'Jack', userID: 'uuid-user-1' })
      )
    ).rejects.toThrowError(CharacterLimitReachedException)
  })

  it('should create a player if no one exists', async () => {
    await createCharacter.execute(
      buildCommand({ name: 'Jack', userID: 'uuid-user-1' })
    )
    const player = await playerRepository.findById('uuid-user-1')

    expect(player?.getLivingCharacters()).toHaveLength(1)
  })

  describe('Character state validation', () => {
    for (const skill of ['attack', 'magic', 'defense']) {
      it(`should throwing an error if skill points are not consumed but ${skill} is greather than 0`, async () => {
        await expectCharacterIsInvalid({
          skillPoints: 12,
          attack: 0,
          magic: 0,
          defense: 0,
          health: 10,
          [skill]: 1,
        })
      })

      it(`should throwing an error if one skill point is consumed but ${skill} is greather than 1`, async () => {
        await expectCharacterIsInvalid({
          skillPoints: 11,
          attack: 0,
          magic: 0,
          defense: 0,
          health: 10,
          [skill]: 2,
        })
      })

      it(`should throwing an error if 8 skill points are consumed but ${skill} is greather than 7`, async () => {
        await expectCharacterIsInvalid({
          skillPoints: 4,
          attack: 0,
          magic: 0,
          defense: 0,
          health: 10,
          [skill]: 8,
        })
      })
    }

    it(`should throwing an error if skill points are not consumed but health is greather than 10`, async () => {
      await expectCharacterIsInvalid({
        skillPoints: 12,
        attack: 0,
        magic: 0,
        defense: 0,
        health: 11,
      })
    })

    it(`should throwing an error if one skill point is consumed but health is greather than 12`, async () => {
      await expectCharacterIsInvalid({
        skillPoints: 11,
        attack: 0,
        magic: 0,
        defense: 0,
        health: 12,
      })
    })
  })

  function buildCommand(
    props: Partial<CreateCharacterCommand> = {}
  ): CreateCharacterCommand {
    return {
      name: 'Jack',
      userID: 'uuid-user-1',
      skillPoints: 0,
      health: 13,
      attack: 3,
      magic: 3,
      defense: 3,
      ...props,
    }
  }

  async function expectCharacterIsInvalid(
    props: Partial<CreateCharacterCommand> = {}
  ) {
    await expect(
      createCharacter.execute(buildCommand(props))
    ).rejects.toThrowError(InvalidCharacterStateException)
  }
})
