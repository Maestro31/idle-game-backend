import { Router } from 'express'
import CreateCharacterCommandHandler from '../../core/player/commands/CreateCharacterCommandHandler'
import DeleteCharacterCommandHandler from '../../core/player/commands/DeleteCharacterCommandHandler'
import SequelizeCharacterRepository from '../../core/player/infra/persistence/SequelizeCharacterRepository'
import SequelizePlayerRepository from '../../core/player/infra/persistence/SequelizePlayerRepository'
import GetCharactersQueryHandler from '../../core/player/queries/GetCharactersQueryHandler'
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

  const { skillPoints, attack, magic, defense, health } = req.body
  try {
    await createCharacter.execute({
      name: req.body.name,
      userID: req.currentUserId,
      skillPoints,
      attack,
      magic,
      defense,
      health,
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

router.get('/', verifyToken, async (req, res) => {
  const getCharacters = new GetCharactersQueryHandler(playerRepository)

  try {
    const response = await getCharacters.execute({ userID: req.currentUserId })
    res.status(200).json(response)
  } catch (e) {
    res.status(400).json({ message: e.message })
  }
})

export default router
