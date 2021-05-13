import Fighter from '../Fighter'

interface FighterBuilderProps {
  health: number
  skillPoints: number
  name: string
  attack: number
  magic: number
  defense: number
  rank: number
  recoveredAt: Date
  ownerID?: string
}

export default class FighterBuilder {
  private props: FighterBuilderProps = {
    health: 13,
    skillPoints: 0,
    name: 'John',
    attack: 6,
    magic: 3,
    defense: 3,
    rank: 3,
    recoveredAt: new Date(),
  }

  constructor(readonly id: string) {}

  withProps(props: Partial<FighterBuilderProps>): FighterBuilder {
    this.props = { ...this.props, ...props }
    return this
  }

  build(): Fighter {
    return new Fighter(
      this.id,
      this.props.name,
      this.props.skillPoints,
      this.props.health,
      this.props.attack,
      this.props.magic,
      this.props.defense,
      this.props.rank,
      this.props.recoveredAt,
      this.props.ownerID
    )
  }
}
