import Player from '../../Player'
import PlayerRepositoryInterface from '../../repositories/PlayerRepositoryInterface'
import CharacterRepositoryInterface from '../../repositories/CharacterRepositoryInterface'

export default class InMemoryPlayerRepository
  implements PlayerRepositoryInterface {
  constructor(private characterRepository: CharacterRepositoryInterface) {}

  async findAll(): Promise<Player[]> {
    return this.players
  }

  async exists(player: Player): Promise<boolean> {
    return (await this.findById(player.id)) !== null
  }

  private players: Player[] = []

  async findById(id: string): Promise<Player | null> {
    const foundPlayer = this.players.find((player) => player.id === id)
    if (foundPlayer == null) return null
    return foundPlayer
  }

  async save(player: Player): Promise<void> {
    player.characters.forEach((character) =>
      this.characterRepository.save(character)
    )

    if (await this.exists(player))
      this.players = this.players.map((p) => (p.id === player.id ? player : p))
    else this.players.push(player)
  }

  feed(players: Player[]) {
    this.players = players
  }
}
