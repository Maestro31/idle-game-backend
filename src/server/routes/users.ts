import { Router } from 'express'
import HasherAdapter from '../../services/HasherAdapter'
import InvalidCredentialsException from '../../core/authentication/exceptions/InvalidCredentialsException'
import verifyToken from '../middlewares/verifyToken'
import RegisterUserCommandHandler from '../../core/authentication/commands/RegisterUserCommandHandler'
import UniqueIdAdapter from '../../services/UniqueIdAdapter'
import JsonWebTokenProvider from '../../services/JsonWebTokenProvider'
import SequelizeUserRepository from '../../core/authentication/infra/persistence/SequelizeUserRepository'
import LoginQueryHandler from '../../core/authentication/queries/LoginQueryHandler'
import GetUserQueryHandler from '../../core/authentication/queries/GetUserQueryHandler'
import UserNotFoundException from '../../core/authentication/exceptions/UserNotFoundException'

const router = Router()

router.post('/', async (req, res, next) => {
  const registerUser = new RegisterUserCommandHandler(
    new SequelizeUserRepository(),
    new UniqueIdAdapter(),
    new HasherAdapter()
  )

  const { firstname, lastname, email, password } = req.body

  try {
    await registerUser.execute({ firstname, lastname, email, password })
    res.sendStatus(201)
  } catch (e) {
    res.status(400).json({ message: e.message })
  }
})

router.post('/signin', async (req, res, next) => {
  const loginUser = new LoginQueryHandler(
    new SequelizeUserRepository(),
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
  const getUser = new GetUserQueryHandler(new SequelizeUserRepository())

  try {
    const response = await getUser.execute({ userID: req.currentUserId })
    res.status(200).json({ user: response })
  } catch (e) {
    if (e instanceof UserNotFoundException)
      res.status(404).json({ message: e.message })
    res.status(400).json({ message: e.message })
  }
})

export default router
