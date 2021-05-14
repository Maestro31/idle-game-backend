import CharacterDAO from './CharacterDAO'
import PlayerDAO from './PlayerDAO'
import UserDAO from './UserDAO'
import BattleResultDAO from './BattleResultDAO'
import BattleLogDAO from './BattleLogDAO'

UserDAO.belongsTo(PlayerDAO, { targetKey: 'userID', foreignKey: 'id' })
PlayerDAO.hasMany(CharacterDAO, {
  scope: {
    status: 'living',
  },
  sourceKey: 'userID',
  foreignKey: 'ownerID',
  as: 'characters',
})

BattleResultDAO.hasOne(CharacterDAO, {
  sourceKey: 'winnerID',
  foreignKey: 'id',
  as: 'winner',
})
BattleResultDAO.hasOne(CharacterDAO, {
  sourceKey: 'looserID',
  foreignKey: 'id',
  as: 'looser',
})

BattleResultDAO.hasMany(BattleLogDAO, {
  sourceKey: 'id',
  foreignKey: 'battleResultID',
  as: 'logs',
})

export { UserDAO, CharacterDAO, PlayerDAO, BattleResultDAO, BattleLogDAO }
