import UniqueIdAdapterStub from '../../../services/UniqueIdAdaperStub'
import CharacterLimitReachedException from '../exceptions/CharacterLimitReachedException'
import InMemoryCharacterRepository from '../infra/persistence/InMemoryCharacterRepository'
import InMemoryPlayerRepository from '../infra/persistence/InMemoryPlayerRepository'
import Player from '../Player'
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
      createCharacter.execute({ name: '', userID: 'uuid-user-1' })
    ).rejects.toThrowError('Field name could not be empty')
  })

  it('should create the character for the given informations', async () => {
    const player = new Player('uuid-user-1')
    playerRepository.feed([player])

    await createCharacter.execute({ name: 'Jack', userID: 'uuid-user-1' })

    const character = player.getLivingCharacters()[0]
    expect(character.name).toBe('Jack')
    expect(character.ownerID).toBe('uuid-user-1')
  })

  it('should not create an eleventh character and throwing an error', async () => {
    const player = new Player('uuid-user-1')
    playerRepository.feed([player])

    for (let i = 0; i < 10; i++) {
      player.addCharacter(`uuid-character-${i}`, `Name-${i}`)
    }

    await expect(
      createCharacter.execute({ name: 'Jack', userID: 'uuid-user-1' })
    ).rejects.toThrowError(CharacterLimitReachedException)
  })

  it('should create a player if no one exists', async () => {
    await createCharacter.execute({ name: 'Jack', userID: 'uuid-user-1' })
    const player = await playerRepository.findById('uuid-user-1')

    expect(player?.getLivingCharacters()).toHaveLength(1)
  })
})
