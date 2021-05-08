import Character, { CharacterProps, Skill } from '../Character'
import NotEnoughSkillPointsException from '../exceptions/NotEnoughSkillPointsException'
import PlayerNotFoundException from '../exceptions/PlayerNotFoundException'
import InMemoryCharacterRepository from '../infra/persistence/InMemoryCharacterRepository'
import InMemoryPlayerRepository from '../infra/persistence/InMemoryPlayerRepository'
import Player from '../Player'
import IncrementCharacterSkillCommandHandler from './IncrementCharacterSkillCommandHandler'

describe('Increment Character Skill', () => {
  let incrementSkill: IncrementCharacterSkillCommandHandler
  let playerRepository: InMemoryPlayerRepository
  let characterRepository: InMemoryCharacterRepository

  beforeEach(() => {
    characterRepository = new InMemoryCharacterRepository()
    playerRepository = new InMemoryPlayerRepository(characterRepository)
    incrementSkill = new IncrementCharacterSkillCommandHandler(playerRepository)
  })

  it('should throwing an error if the player does not exists', async () => {
    await expect(
      incrementSkill.execute({
        skill: 'attack',
        userID: 'uuid-user-1',
        characterID: 'uuid-character-1',
      })
    ).rejects.toThrowError(PlayerNotFoundException)
  })

  describe('Not Enough skill points', () => {
    for (const skill of ['attack', 'magic', 'defense']) {
      it(`should throwing an error when attempt to increment ${skill} from 3 to 4`, async () => {
        await expectIncrementThrowingNotEnoughSkillPoints(skill, {
          [skill]: 3,
          skillPoints: 0,
        })
      })

      it(`should throwing an error when attempt to increment ${skill} from 6 to 7`, async () => {
        await expectIncrementThrowingNotEnoughSkillPoints(skill, {
          defense: 0,
          magic: 0,
          health: 10,
          attack: 0,
          [skill]: 6,
          skillPoints: 1,
          rank: 1,
        })
      })
    }

    describe('Have Enough skill points', () => {
      for (const skill of ['attack', 'magic', 'defense']) {
        it(`should increment ${skill} from 3 to 4`, async () => {
          await expectIncrementSkill(skill, { [skill]: 3, skillPoints: 1 }, 4)
        })

        it(`should increment ${skill} from 8 to 9`, async () => {
          await expectIncrementSkill(
            skill,
            {
              health: 10,
              defense: 0,
              magic: 0,
              attack: 0,
              [skill]: 8,
              skillPoints: 2,
            },
            9
          )
        })
      }

      it('should increment health from 10 to 11', async () => {
        await expectIncrementSkill('health', { health: 10, skillPoints: 1 }, 11)
      })
    })
  })

  async function expectIncrementThrowingNotEnoughSkillPoints(
    skill: string,
    characterProps: Partial<CharacterProps>
  ) {
    setup(characterProps)

    await expect(
      incrementSkill.execute({
        skill,
        userID: 'uuid-user-1',
        characterID: 'uuid-character-1',
      })
    ).rejects.toThrowError(NotEnoughSkillPointsException)
  }

  async function expectIncrementSkill(
    skill: string,
    characterProps: Partial<CharacterProps>,
    expectCount: number
  ) {
    const character = setup(characterProps)

    await incrementSkill.execute({
      skill,
      userID: 'uuid-user-1',
      characterID: 'uuid-character-1',
    })

    const props = character.toPrimitives()

    expect(props[skill as Skill]).toBe(expectCount)
  }

  function setup(characterProps: Partial<CharacterProps>) {
    const character = Character.fromPrimitives({
      id: 'uuid-character-1',
      name: 'John',
      skillPoints: 0,
      health: 13,
      attack: 3,
      magic: 3,
      defense: 3,
      rank: 1,
      recoveredAt: new Date(),
      ownerID: 'uuid-user-1',
      ...characterProps,
    })

    const player = new Player('uuid-user-1', [character])

    playerRepository.feed([player])
    characterRepository.feed([character])
    return character
  }
})
