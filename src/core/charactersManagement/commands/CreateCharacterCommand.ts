export default interface CreateCharacterCommand {
  name: string
  userID: string
  skillPoints: number
  attack: number
  health: number
  magic: number
  defense: number
}
