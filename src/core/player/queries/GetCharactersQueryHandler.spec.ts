import Character, { CharacterStatus } from '../Character'
import InMemoryCharacterRepository from '../infra/persistence/InMemoryCharacterRepository'
import InMemoryPlayerRepository from '../infra/persistence/InMemoryPlayerRepository'
import Player from '../Player'
import GetCharactersQueryHandler from './GetCharactersQueryHandler'

describe('Get Characters', () => {
  let characterRepository: InMemoryCharacterRepository
  let playerRepository: InMemoryPlayerRepository
  let getCharacters: GetCharactersQueryHandler

  beforeEach(() => {
    characterRepository = new InMemoryCharacterRepository()
    playerRepository = new InMemoryPlayerRepository(characterRepository)
    getCharacters = new GetCharactersQueryHandler(playerRepository)
  })

  it('should return an empty list', async () => {
    const player = new Player('uuid-user-1', [])
    playerRepository.feed([player])

    expect(await getCharacters.execute({ userID: 'uuid-user-1' })).toEqual([])
  })

  it('should return a list of characters', async () => {
    const player = new Player('uuid-user-1', [])
    playerRepository.feed([player])

    player.addCharacter('uuid-character-1', 'Jack', 12, 10, 0, 0, 0)
    player.addCharacter('uuid-character-2', 'John', 12, 10, 0, 0, 0)

    playerRepository.save(player)

    const response = await getCharacters.execute({ userID: 'uuid-user-1' })
    expect(response).toHaveLength(2)
  })

  it('should not return characters marked as deleted', async () => {
    const player = new Player('uuid-user-1')
    playerRepository.feed([player])

    player.addCharacter('uuid-character-1', 'Jack', 12, 10, 0, 0, 0)
    player.addCharacter('uuid-character-2', 'John', 12, 10, 0, 0, 0)

    player.setCharacterStatusAsDeleted('uuid-character-1')
    characterRepository.feed(player.getLivingCharacters())

    playerRepository.save(player)

    const response = await getCharacters.execute({ userID: 'uuid-user-1' })
    expect(response).toHaveLength(1)
  })
})
