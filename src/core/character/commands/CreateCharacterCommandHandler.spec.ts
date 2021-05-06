import DateProviderStub from '../../../services/DateProviderStub'
import RealCharacterCreator from '../../../game/RealCharacterCreator'
import InMemoryCharacterRepository from '../infra/persistence/InMemoryCharacterRepository'
import CreateCharacterCommandHandler from './CreateCharacterCommandHandler'
import UniqueIdAdapterStub from '../../../services/UniqueIdAdaperStub'
import InvalidArgumentsException from '../../../shared/domain/exceptions/InvalidArgumentException'

describe('Create character', () => {
  let characterRepository: InMemoryCharacterRepository
  let createCharacter: CreateCharacterCommandHandler
  let uniqueIdAdapter: UniqueIdAdapterStub
  let dateProvider: DateProviderStub

  beforeEach(() => {
    uniqueIdAdapter = new UniqueIdAdapterStub()
    characterRepository = new InMemoryCharacterRepository()
    dateProvider = new DateProviderStub()

    createCharacter = new CreateCharacterCommandHandler(
      characterRepository,
      uniqueIdAdapter,
      dateProvider,
      new RealCharacterCreator()
    )
  })
  it('should create character with the given informations', async () => {
    uniqueIdAdapter.willRespond('uuid-character-1')
    const date = new Date()
    dateProvider.willRespond(date)

    await createCharacter.execute({ name: 'John', ownerID: 'uuid-user-1' })

    const character = (await characterRepository.findAll())[0]

    expect(character.toPrimitives()).toEqual({
      id: 'uuid-character-1',
      name: 'John',
      health: 10,
      skillPoints: 12,
      attack: 0,
      magic: 0,
      defense: 0,
      rank: 0,
      recoveredAt: date,
      ownerID: 'uuid-user-1',
    })
  })

  it('should throwing an error when name is empty', async () => {
    await expect(
      createCharacter.execute({ name: '', ownerID: 'uuid-user-1' })
    ).rejects.toThrowError(InvalidArgumentsException)
  })

  // it('should throwing an error when owner does not exists with the given id', () => {
  //   await expect(
  //     createCharacter.execute({ name: '', ownerID: 'uuid-user-1' })
  //   ).rejects.toThrowError(InvalidArgumentsException)
  // })
})
