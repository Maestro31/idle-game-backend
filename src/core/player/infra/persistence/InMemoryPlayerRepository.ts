import Player from '../../Player'
import PlayerRepositoryInterface from '../../repostitory/PlayerRepositoryInterface'

export default class InMemoryPlayerRepository
  implements PlayerRepositoryInterface {
  private players: Player[] = []

  findById(id: string): Promise<Player | null> {
    const foundPlayer = this.players.find((player) => player.id === id)
    if (foundPlayer == null) return Promise.resolve(null)
    return Promise.resolve(foundPlayer)
  }

  async save(player: Player): Promise<void> {
    this.players.push(player)
    return Promise.resolve()
  }

  feed(players: Player[]) {
    this.players = players
  }
}
