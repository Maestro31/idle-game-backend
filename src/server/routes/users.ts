import { Router } from 'express'
import HasherAdapter from '../../services/HasherAdapter'
import InvalidCredentialsException from '../../core/user/exceptions/InvalidCredentialsException'
import verifyToken from '../middlewares/verifyToken'
import LoginCommandHandler from '../../core/user/commands/LoginCommandHandler'
import RegisterUserCommandHandler from '../../core/user/commands/RegisterUserCommandHandler'
import SQLiteUserRepository from '../../core/user/infra/persistence/SQLiteUserRepository'
import UniqueIdAdapter from '../../services/UniqueIdAdapter'
import JsonWebTokenProvider from '../../services/JsonWebTokenProvider'

const router = Router()

router.post('/', async (req, res, next) => {
  const registerUser = new RegisterUserCommandHandler(
    new SQLiteUserRepository(),
    new UniqueIdAdapter(),
    new HasherAdapter()
  )

  const { firstname, lastname, email, password } = req.body

  try {
    await registerUser.execute({ firstname, lastname, email, password })
    res.status(201).send()
  } catch (e) {
    res.status(400).json({ message: e.message })
  }
})

router.post('/signin', async (req, res, next) => {
  const loginUser = new LoginCommandHandler(
    new SQLiteUserRepository(),
    new HasherAdapter(),
    new JsonWebTokenProvider()
  )

  const { email, password } = req.body
  try {
    const response = await loginUser.execute({ email, password })
    res.status(200).json(response)
  } catch (e) {
    if (e instanceof InvalidCredentialsException)
      res.status(401).json({ message: e.message })
    else res.status(400).json({ message: e.message })
  }
})

router.get('/me', verifyToken, async (req, res, next) => {
  const userRepository = new SQLiteUserRepository()

  try {
    const user = await userRepository.findById(req.currentUserId)
    if (!user) {
      return res.status(404)
    }

    const { hashedPassword, ...userProps } = user.toPrimitives()

    res.status(200).json({ user: userProps })
  } catch (e) {
    res.status(400).json({ message: e.message })
  }
})

export default router
