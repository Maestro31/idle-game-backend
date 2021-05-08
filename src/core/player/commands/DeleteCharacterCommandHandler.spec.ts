import Character, { CharacterStatus } from '../Character'
import CharacterNotFoundException from '../exceptions/CharacterNotFoundException'
import PlayerNotFoundException from '../exceptions/PlayerNotFoundException'
import InMemoryCharacterRepository from '../infra/persistence/InMemoryCharacterRepository'
import InMemoryPlayerRepository from '../infra/persistence/InMemoryPlayerRepository'
import Player from '../Player'
import DeleteCharacterCommandHandler from './DeleteCharacterCommandHandler'

describe('Delete Character', () => {
  let playerRepository: InMemoryPlayerRepository
  let characterRepository: InMemoryCharacterRepository
  let deleteCharacter: DeleteCharacterCommandHandler

  beforeEach(() => {
    characterRepository = new InMemoryCharacterRepository()
    playerRepository = new InMemoryPlayerRepository(characterRepository)
    deleteCharacter = new DeleteCharacterCommandHandler(playerRepository)
  })

  it('should throwing player not found when the given user id is unknown', async () => {
    await expect(
      deleteCharacter.execute({
        characterID: 'uuid-character-1',
        userID: 'invalid',
      })
    ).rejects.toThrowError(PlayerNotFoundException)
  })

  it('should throwing player not found when the given character id is unknown', async () => {
    const player = new Player('uuid-user-1')

    playerRepository.feed([player])

    await expect(
      deleteCharacter.execute({
        characterID: 'invalid',
        userID: 'uuid-user-1',
      })
    ).rejects.toThrowError(CharacterNotFoundException)
  })

  it('should update the character status to deleted', async () => {
    const character = Character.fromPrimitives({
      id: 'uuid-character-1',
      name: 'Jack',
      rank: 0,
      skillPoints: 12,
      health: 10,
      attack: 0,
      magic: 0,
      defense: 0,
      recoveredAt: new Date(),
      ownerID: 'uuid-user-1',
    })

    const player = new Player('uuid-user-1', [character])

    playerRepository.feed([player])
    characterRepository.feed([character])

    await deleteCharacter.execute({
      characterID: 'uuid-character-1',
      userID: 'uuid-user-1',
    })

    expect(character.getStatus()).toBe(CharacterStatus.DELETED)
  })
})
