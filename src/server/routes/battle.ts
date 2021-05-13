import { Router } from 'express'
import CreateBattleCommandHandler from '../../core/battle/commands/CreateBattleCommandHandler'
import SequelizeBattleRepository from '../../core/battle/infra/persistence/SequelizeBattleRepository'
import SequelizeFighterRepository from '../../core/battle/infra/persistence/SequelizeFighterRepository'
import RealOpponentSelector from '../../core/battle/infra/services/RealOpponnentSelector'
import RealRandom from '../../game/services/RealRandom'
import RealDateProvider from '../../services/RealDateProvider'
import UniqueIdAdapter from '../../services/UniqueIdAdapter'
import verifyToken from '../middlewares/verifyToken'
const router = Router()

router.post('/', verifyToken, async (req, res, next) => {
  const randomService = new RealRandom()
  const createBattle = new CreateBattleCommandHandler(
    new SequelizeBattleRepository(new SequelizeFighterRepository()),
    new UniqueIdAdapter(),
    new RealOpponentSelector(randomService, new RealDateProvider()),
    randomService,
    new RealDateProvider()
  )

  try {
    await createBattle.execute({ characterID: req.body.characterID })
  } catch (e) {
    res.status(400).json({ message: e.message })
  }
})

export default router
