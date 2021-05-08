import CharacterDAO from './CharacterDAO'
import PlayerDAO from './PlayerDAO'
import UserDAO from './UserDAO'

UserDAO.belongsTo(PlayerDAO, { targetKey: 'userID', foreignKey: 'id' })
PlayerDAO.hasMany(CharacterDAO, {
  scope: {
    status: 'living',
  },
  sourceKey: 'userID',
  foreignKey: 'ownerID',
  as: 'characters',
})

export { UserDAO, CharacterDAO, PlayerDAO }
