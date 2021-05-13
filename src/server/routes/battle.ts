import { Router } from 'express'
import CreateBattleCommandHandler from '../../core/fighting/commands/CreateBattleCommandHandler'
import SequelizeBattleRepository from '../../core/fighting/infra/persistence/SequelizeBattleRepository'
import SequelizeFighterRepository from '../../core/fighting/infra/persistence/SequelizeFighterRepository'
import RealOpponentSelector from '../../core/fighting/infra/services/RealOpponnentSelector'
import RealRandom from '../../services/RealRandom'
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
    const battle = await createBattle.execute({
      characterID: req.body.characterID,
    })
    res.status(200).json(battle)
  } catch (e) {
    res.status(400).json({ message: e.message })
  }
})

export default router
