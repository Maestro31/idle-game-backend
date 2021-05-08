import InvalidCharacterStateException from './exceptions/InvalidCharacterStateException'

export enum CharacterStatus {
  LIVING = 'living',
  DELETED = 'deleted',
}

export interface CharacterProps {
  id: string
  name: string
  skillPoints: number
  health: number
  attack: number
  magic: number
  defense: number
  rank: number
  recoveredAt: Date
  ownerID?: string
  status?: CharacterStatus
}

export default class Character {
  static readonly INITIAL_SKILL_POINTS_COUNT = 12
  static readonly INITIAL_HEALTH_POINTS_COUNT = 10

  constructor(
    readonly id: string,
    readonly name: string,
    readonly skillPoints: number,
    readonly health: number,
    readonly attack: number,
    readonly magic: number,
    readonly defense: number,
    readonly rank: number,
    readonly recoveredAt: Date,
    private status: CharacterStatus = CharacterStatus.LIVING,
    readonly ownerID: string | undefined
  ) {
    this.guardStateIsValid()
  }

  getStatus(): CharacterStatus {
    return this.status
  }

  setStatus(status: CharacterStatus) {
    this.status = status
  }

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
      status: this.status,
      ownerID: this.ownerID,
    }
  }

  static fromPrimitives(props: CharacterProps): Character {
    return new Character(
      props.id,
      props.name,
      props.skillPoints,
      props.health,
      props.attack,
      props.magic,
      props.defense,
      props.rank,
      props.recoveredAt,
      props.status,
      props.ownerID || undefined
    )
  }

  private guardStateIsValid() {
    if (this.totalCostOfSkills() > this.totalOfConsumedSkillPoints()) {
      throw new InvalidCharacterStateException()
    }
  }

  private totalCostOfSkills(): number {
    return (
      this.calculateCostOfHealth() +
      this.calculateCostOfSkill(this.attack) +
      this.calculateCostOfSkill(this.magic) +
      this.calculateCostOfSkill(this.defense)
    )
  }

  private totalOfConsumedSkillPoints(): number {
    return Character.INITIAL_SKILL_POINTS_COUNT - this.skillPoints + this.rank
  }

  private calculateCostOfHealth(): number {
    return this.health - Character.INITIAL_HEALTH_POINTS_COUNT
  }

  private calculateCostOfSkill(count: number): number {
    if (count === 0) return 0
    const cost = Math.max(Math.ceil((count - 1) / 5), 1)
    return count === 1 ? cost : cost + this.calculateCostOfSkill(count - 1)
  }
}
