export interface CharacterProps {
  id?: string
  name: string
  skillPoints: number
  health: number
  attack: number
  magic: number
  defense: number
  rank: number
  recoveredAt: Date
  ownerID?: string
}

export default class Character {
  constructor(
    private id: string | undefined,
    readonly name: string,
    readonly skillPoints: number,
    readonly health: number,
    readonly attack: number,
    readonly magic: number,
    readonly defense: number,
    readonly rank: number,
    readonly recoveredAt: Date,
    readonly ownerID: string | undefined
  ) {}

  toPrimitives(): CharacterProps {
    return {
      id: this.id,
      name: this.name,
      skillPoints: this.skillPoints,
      health: this.health,
      magic: this.magic,
      attack: this.attack,
      defense: this.defense,
      rank: this.rank,
      recoveredAt: this.recoveredAt,
      ownerID: this.ownerID,
    }
  }

  static fromPrimitives(props: CharacterProps): Character {
    return new Character(
      props.id || undefined,
      props.name,
      props.skillPoints,
      props.health,
      props.attack,
      props.magic,
      props.defense,
      props.rank,
      props.recoveredAt,
      props.ownerID || undefined
    )
  }
}
