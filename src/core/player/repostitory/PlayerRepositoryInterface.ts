import Player from '../Player'

export default interface PlayerRepositoryInterface {
  findById(id: string): Promise<Player | null>
  save(player: Player): Promise<void>
}
