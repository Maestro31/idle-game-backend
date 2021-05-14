import app from '../app'
import request from 'supertest'
import { CharacterDAO } from '../../sequelize/models'

export async function signIn(email: string, password: string): Promise<string> {
  const { body } = await request(app)
    .post('/users/signin')
    .send({ email, password })
    .expect(200)
  return body.authToken
}

export async function createCharacter(id: string, ownerID: string) {
  const characterProps = {
    id,
    name: 'John',
    health: 13,
    attack: 5,
    magic: 3,
    defense: 2,
    rank: 3,
    skillPoints: 1,
    status: 'living',
    recoveredAt: new Date(),
  }

  await CharacterDAO.create({ ...characterProps, ownerID })
}
