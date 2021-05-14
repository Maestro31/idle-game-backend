import { UserDAO } from '../../sequelize/models'
import request from 'supertest'
import bcrypt from 'bcrypt'
import app from '../app'
import { signIn } from './helpers'

describe('Users Router', () => {
  afterEach(() => {
    UserDAO.destroy({ truncate: true })
  })

  describe('User creation', () => {
    it('should create user', async () => {
      await request(app)
        .post('/users')
        .send({
          firstname: 'John',
          lastname: 'Doe',
          email: 'john@doe.fr',
          password: '123456',
        })
        .expect(201)

      const user = (await UserDAO.findAll())[0]
      expect(user.firstname).toBe('John')
    })

    for (const field of ['firstname', 'lastname', 'email', 'password']) {
      it(`should not create user and return status 400 whith blank ${field}`, async () => {
        const { body } = await request(app)
          .post('/users')
          .send({
            firstname: 'John',
            lastname: 'Doe',
            email: 'john@doe.fr',
            password: '123456',
            [field]: undefined,
          })
          .expect(400)

        const users = await UserDAO.findAll()
        expect(users).toHaveLength(0)
        expect(body.message).toBe(`Field ${field} could not be empty`)
      })
    }
  })

  describe('User signin', () => {
    beforeEach(async () => {
      await UserDAO.create({
        id: 'uuid-user-1',
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@doe.com',
        hashedPassword: bcrypt.hashSync('123456', 10),
      })
    })

    it('should signin user', async () => {
      const { body } = await request(app)
        .post('/users/signin')
        .send({ email: 'john@doe.com', password: '123456' })
        .expect(200)

      expect(body.authToken).toBeDefined()
      expect(body.user.firstname).toBe('John')
    })

    it('should return 400 when email is not provided', async () => {
      const { body } = await request(app)
        .post('/users/signin')
        .send({ password: '123456' })
        .expect(400)

      expect(body.authToken).toBeUndefined()
    })

    it('should return 400 when pasword is not provided', async () => {
      const { body } = await request(app)
        .post('/users/signin')
        .send({ email: 'john@doe.com' })
        .expect(400)

      expect(body.authToken).toBeUndefined()
    })

    it('should return 401 whith bad email', async () => {
      const { body } = await request(app)
        .post('/users/signin')
        .send({ email: 'bad-email@doe.com', password: '123456' })
        .expect(401)

      expect(body.authToken).toBeUndefined()
    })

    it('should return 401 whith bad password', async () => {
      const { body } = await request(app)
        .post('/users/signin')
        .send({ email: 'john@doe.com', password: 'bad-password' })
        .expect(401)

      expect(body.authToken).toBeUndefined()
    })
  })

  describe('Get Me', () => {
    beforeEach(async () => {
      await UserDAO.create({
        id: 'uuid-user-1',
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@doe.com',
        hashedPassword: bcrypt.hashSync('123456', 10),
      })
    })

    it('should return the currentUser', async () => {
      const authToken = await signIn('john@doe.com', '123456')

      const { body } = await request(app)
        .get('/users/me')
        .set({ Authorization: `Bearer ${authToken}` })
        .expect(200)

      expect(body).toEqual({
        user: {
          email: 'john@doe.com',
          firstname: 'John',
          lastname: 'Doe',
        },
      })
    })

    it('should return 403 when jwt token is not provided', async () => {
      await request(app).get('/users/me').expect(403)
    })
  })
})
