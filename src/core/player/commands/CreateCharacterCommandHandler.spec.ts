import UniqueIdAdapterStub from '../../../services/UniqueIdAdaperStub'
import InvalidArgumentsException from '../../../shared/domain/exceptions/InvalidArgumentException'
import CharacterLimitReachedException from '../exceptions/CharacterLimitReachedException'
import PlayerNotFoundException from '../exceptions/PlayerNotFoundException'
import InMemoryPlayerRepository from '../infra/persistence/InMemoryPlayerRepository'
import Player from '../Player'
import CreateCharacterCommandHandler from './CreateCharacterCommandHandler'

describe('Create Character Command', () => {
  let createCharacter: CreateCharacterCommandHandler
  let playerRepository: InMemoryPlayerRepository
  let uniqueIdAdapter: UniqueIdAdapterStub

  beforeEach(() => {
    playerRepository = new InMemoryPlayerRepository()
    uniqueIdAdapter = new UniqueIdAdapterStub()
    createCharacter = new CreateCharacterCommandHandler(
      playerRepository,
      uniqueIdAdapter
    )
  })

  it('should throwing an error if the given user not exists', async () => {
    await expect(
      createCharacter.execute({ name: 'Jack', userID: 'invalid-user-id' })
    ).rejects.toThrowError(PlayerNotFoundException)
  })

  it('should throwing an error when the name is empty', async () => {
    const player = new Player('uuid-user-1', [])
    playerRepository.feed([player])

    await expect(
      createCharacter.execute({ name: '', userID: 'uuid-user-1' })
    ).rejects.toThrowError(InvalidArgumentsException)
  })

  it('should create the character for the given informations', async () => {
    const player = new Player('uuid-user-1', [])
    playerRepository.feed([player])

    await createCharacter.execute({ name: 'Jack', userID: 'uuid-user-1' })

    const character = player.getCharacters()[0]
    expect(character.name).toBe('Jack')
    expect(character.ownerID).toBe('uuid-user-1')
  })

  it('should not create an eleventh character and throwing an error', async () => {
    const player = new Player('uuid-user-1', [])
    playerRepository.feed([player])

    for (let i = 0; i < 10; i++) {
      player.addCharacter(`uuid-character-${i}`, `Name-${i}`)
    }

    await expect(
      createCharacter.execute({ name: 'Jack', userID: 'uuid-user-1' })
    ).rejects.toThrowError(CharacterLimitReachedException)
  })
})
