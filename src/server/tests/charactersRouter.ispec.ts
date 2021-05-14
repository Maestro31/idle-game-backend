import {
  BattleResultDAO,
  CharacterDAO,
  PlayerDAO,
  UserDAO,
} from '../../sequelize/models'
import bcrypt from 'bcrypt'
import { createCharacter, signIn } from './helpers'
import request from 'supertest'
import app from '../app'

describe('Characters Router', () => {
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

  describe('Create character', () => {
    const validParams = {
      name: 'My first character',
      skillPoints: 11,
      health: 10,
      attack: 0,
      magic: 1,
      defense: 0,
    }

    it('should create character', async () => {
      await request(app)
        .post('/characters')
        .set({ Authorization: `Bearer ${authToken}` })
        .send(validParams)
        .expect(201)

      const character = (await CharacterDAO.findAll())[0]
      expect(character.name).toBe('My first character')
    })

    for (const field of [
      'name',
      'skillPoints',
      'health',
      'attack',
      'magic',
      'defense',
    ]) {
      it(`should return 400 for bad request when ${field} is blank`, async () => {
        await request(app)
          .post('/characters')
          .set({ Authorization: `Bearer ${authToken}` })
          .send({
            ...validParams,
            [field]: undefined,
          })
          .expect(400)
      })
    }

    it('should return 403 when auth token is not provided', async () => {
      await request(app).post('/characters').send(validParams).expect(403)
    })
  })

  describe('Delete character', () => {
    const characterID = 'uuid-character-1'
    beforeEach(async () => {
      await createCharacter(characterID, userID)
    })

    it('should mark the character with the given id as deleted', async () => {
      await request(app)
        .delete(`/characters/${characterID}`)
        .set({ Authorization: `Bearer ${authToken}` })
        .expect(204)

      const character: any = await CharacterDAO.findByPk(characterID)
      expect(character.status).toBe('deleted')
    })

    it('should return 400 if the given id does not exists', async () => {
      await request(app)
        .delete(`/characters/bad-character-id`)
        .set({ Authorization: `Bearer ${authToken}` })
        .expect(400)
    })

    it('should return 403 when auth token not provided', async () => {
      await request(app).delete(`/characters/bad-character-id`).expect(403)
    })
  })

  describe('Increment Skill', () => {
    const characterID = 'uuid-character-1'
    beforeEach(async () => {
      await createCharacter(characterID, userID)
    })

    for (const skill of ['attack', 'health', 'magic', 'defense']) {
      it(`should increment ${skill}`, async () => {
        await request(app)
          .post(`/characters/${characterID}/increment/${skill}`)
          .set({ Authorization: `Bearer ${authToken}` })
          .expect(204)
      })

      it(`should return 400 when increment ${skill} on invalid character id`, async () => {
        await request(app)
          .post(`/characters/bad-character-id/increment/${skill}`)
          .set({ Authorization: `Bearer ${authToken}` })
          .expect(400)
      })

      it(`should return 403 when increment ${skill} if auth token is not provided`, async () => {
        await request(app)
          .post(`/characters/${characterID}/increment/${skill}`)
          .expect(403)
      })
    }

    it('should return 404 when attempt to increment invalid skill', async () => {
      await request(app)
        .post(`/characters/${characterID}/increment/invalid-skill`)
        .set({ Authorization: `Bearer ${authToken}` })
        .expect(404)
    })
  })

  describe('Get characters', () => {
    it('should return empty characters list', async () => {
      const { body } = await request(app)
        .get('/characters')
        .set({ Authorization: `Bearer ${authToken}` })
        .expect(200)
      expect(body).toHaveLength(0)
    })

    it(`should return 403 when auth token is not provided`, async () => {
      await request(app).get('/characters').expect(403)
    })

    it('should return character list with two elements', async () => {
      await createCharacter('uuid-character-1', userID)
      await createCharacter('uuid-character-2', userID)

      const { body } = await request(app)
        .get('/characters')
        .set({ Authorization: `Bearer ${authToken}` })
        .expect(200)

      expect(body).toHaveLength(2)
    })
  })

  describe('Get character history', () => {
    const characterID = 'uuid-character-1'
    const opponentID = 'uuid-opponent-1'

    beforeEach(async () => {
      await createCharacter(characterID, userID)
      await createCharacter(opponentID, 'uuid-user-2')
    })

    it('should return empty list', async () => {
      const { body } = await request(app)
        .get(`/characters/${characterID}/history`)
        .set({ Authorization: `Bearer ${authToken}` })
        .expect(200)

      expect(body).toHaveLength(0)
    })

    it('should return two elements', async () => {
      await createBattleHistory(characterID, opponentID)
      await createBattleHistory(characterID, opponentID)

      const { body } = await request(app)
        .get(`/characters/${characterID}/history`)
        .set({ Authorization: `Bearer ${authToken}` })
        .expect(200)

      expect(body).toHaveLength(2)
    })

    it('should return 403 when auth token is not provided', async () => {
      await request(app).get(`/characters/${characterID}/history`).expect(403)
    })
  })

  async function createBattleHistory(id: string, opponentID: string) {
    await BattleResultDAO.create({
      winnerID: id,
      looserID: opponentID,
      draw: false,
    })
  }
})
