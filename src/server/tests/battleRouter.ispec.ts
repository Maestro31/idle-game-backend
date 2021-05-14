import {
  UserDAO,
  PlayerDAO,
  CharacterDAO,
  BattleResultDAO,
} from '../../sequelize/models'
import { createCharacter, signIn } from './helpers'
import bcrypt from 'bcrypt'
import app from '../app'
import request from 'supertest'

describe('Battle Router', () => {
  let authToken: string
  const userID = 'uuid-user-1'

  beforeEach(async () => {
    await UserDAO.create({
      id: userID,
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@doe.com',
      hashedPassword: bcrypt.hashSync('123456', 10),
    })

    await PlayerDAO.create({ userID })
    authToken = await signIn('john@doe.com', '123456')
  })

  afterEach(async () => {
    await CharacterDAO.destroy({ truncate: true })
    await UserDAO.destroy({ truncate: true })
    await PlayerDAO.destroy({ truncate: true })
    await BattleResultDAO.destroy({ truncate: true })
  })

  describe('Create battle', () => {
    const characterID = 'uuid-character-1'
    beforeEach(async () => {
      await createCharacter(characterID, userID)
    })

    it('should return 400 when no opponent found', async () => {
      await request(app)
        .post('/battle')
        .set({ Authorization: `Bearer ${authToken}` })
        .send({ characterID })
        .expect(400)
    })

    it('should create a battle', async () => {
      await createCharacter('uuid-opponent-1', 'uuid-user-2')

      const { body } = await request(app)
        .post('/battle')
        .set({ Authorization: `Bearer ${authToken}` })
        .send({ characterID })
        .expect(200)

      expect(body).toBeDefined()
    })
  })
})
