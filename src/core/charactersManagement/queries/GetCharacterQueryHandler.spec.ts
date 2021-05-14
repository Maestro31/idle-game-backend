import CharacterNotFoundException from '../exceptions/CharacterNotFoundException'
import PlayerNotFoundException from '../exceptions/PlayerNotFoundException'
import InMemoryCharacterRepository from '../infra/persistence/InMemoryCharacterRepository'
import InMemoryPlayerRepository from '../infra/persistence/InMemoryPlayerRepository'
import Player from '../Player'
import GetCharacterQueryHandler from './GetCharacterQueryHandler'

describe('Get character', () => {
  let characterRepository: InMemoryCharacterRepository
  let playerRepository: InMemoryPlayerRepository
  let getCharacter: GetCharacterQueryHandler
  const userID = 'uuid-user-1'
  let player: Player

  beforeEach(() => {
    characterRepository = new InMemoryCharacterRepository()
    playerRepository = new InMemoryPlayerRepository(characterRepository)
    getCharacter = new GetCharacterQueryHandler(playerRepository)
    player = new Player(userID, [])
    playerRepository.feed([player])
  })

  it('should throw error when player does not exists', async () => {
    await expect(
      getCharacter.execute({
        characterID: 'bad-character-id',
        userID: 'bad-player-id',
      })
    ).rejects.toThrowError(PlayerNotFoundException)
  })

  it('should throw error when character does not exists', async () => {
    await expect(
      getCharacter.execute({
        characterID: 'bad-character-id',
        userID,
      })
    ).rejects.toThrowError(CharacterNotFoundException)
  })

  it('should return the character for the given id', async () => {
    player.addCharacter('uuid-character-1', 'Jack', 12, 10, 0, 0, 0)
    player.addCharacter('uuid-character-2', 'John', 12, 10, 0, 0, 0)

    const result = await getCharacter.execute({
      characterID: 'uuid-character-1',
      userID,
    })

    expect(result.name).toBe('Jack')
  })

  it('should throw error when all characters are deleted', async () => {
    player.addCharacter('uuid-character-1', 'Jack', 12, 10, 0, 0, 0)
    player.setCharacterStatusAsDeleted('uuid-character-1')

    await expect(
      getCharacter.execute({
        characterID: 'uuid-character-1',
        userID,
      })
    ).rejects.toThrowError(CharacterNotFoundException)
  })
})
