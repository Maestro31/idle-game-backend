import { Router } from 'express'
import CreateCharacterCommandHandler from '../../core/charactersManagement/commands/CreateCharacterCommandHandler'
import DeleteCharacterCommandHandler from '../../core/charactersManagement/commands/DeleteCharacterCommandHandler'
import IncrementCharacterSkillCommandHandler from '../../core/charactersManagement/commands/IncrementCharacterSkillCommandHandler'
import SequelizeCharacterRepository from '../../core/charactersManagement/infra/persistence/SequelizeCharacterRepository'
import SequelizePlayerRepository from '../../core/charactersManagement/infra/persistence/SequelizePlayerRepository'
import GetCharacterHistoryQueryHandler from '../../core/charactersManagement/queries/GetCharacterHistoryQueryHandler'
import GetCharacterQueryHandler from '../../core/charactersManagement/queries/GetCharacterQueryHandler'
import GetCharactersQueryHandler from '../../core/charactersManagement/queries/GetCharactersQueryHandler'
import UniqueIdAdapter from '../../services/UniqueIdAdapter'
import verifyToken from '../middlewares/verifyToken'

const router = Router()

const characterRepository = new SequelizeCharacterRepository()
const playerRepository = new SequelizePlayerRepository(characterRepository)
const uniqueIdAdapter = new UniqueIdAdapter()

router.post('/', verifyToken, async (req, res) => {
  const createCharacter = new CreateCharacterCommandHandler(
    playerRepository,
    uniqueIdAdapter
  )

  try {
    await createCharacter.execute({
      name: req.body.name,
      userID: req.currentUserId,
    })
    res.status(201).send()
  } catch (e) {
    res.status(400).json({ message: e.message })
  }
})

router.delete('/:characterID', verifyToken, async (req, res) => {
  const deleteCharacter = new DeleteCharacterCommandHandler(playerRepository)

  try {
    await deleteCharacter.execute({
      characterID: req.params.characterID,
      userID: req.currentUserId,
    })
    res.status(204).send()
  } catch (e) {
    res.status(400).json({ message: e.message })
  }
})

router.post('/:characterID/increment/:skill', verifyToken, async (req, res) => {
  if (
    ['attack', 'magic', 'defense', 'health'].indexOf(req.params.skill) === -1
  ) {
    return res.sendStatus(404)
  }

  const incrementSkill = new IncrementCharacterSkillCommandHandler(
    playerRepository
  )
  try {
    await incrementSkill.execute({
      skill: req.params.skill,
      userID: req.currentUserId,
      characterID: req.params.characterID,
    })
    res.sendStatus(204)
  } catch (e) {
    res.status(400).json({ message: e.message })
  }
})

router.get('/', verifyToken, async (req, res) => {
  const getCharacters = new GetCharactersQueryHandler(playerRepository)

  try {
    const response = await getCharacters.execute({ userID: req.currentUserId })
    res.status(200).json(response)
  } catch (e) {
    res.status(400).json({ message: e.message })
  }
})

router.get('/:characterID', verifyToken, async (req, res) => {
  const getCharacter = new GetCharacterQueryHandler(playerRepository)

  try {
    const response = await getCharacter.execute({
      characterID: req.params.characterID,
      userID: req.currentUserId,
    })
    res.status(200).json(response)
  } catch (e) {
    res.status(400).json({ message: e.message })
  }
})

router.get('/:characterID/history', verifyToken, async (req, res) => {
  const getCharacterHistory = new GetCharacterHistoryQueryHandler()

  if (!req.params.characterID) return res.sendStatus(404)

  try {
    const histories = await getCharacterHistory.execute({
      characterID: req.params.characterID,
    })
    res.status(200).json(histories)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
})

export default router
