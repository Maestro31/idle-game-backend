import InvalidCharacterStateException from './exceptions/InvalidCharacterStateException'
import NotEnoughSkillPointsException from './exceptions/NotEnoughSkillPointsException'

export enum CharacterStatus {
  LIVING = 'living',
  DELETED = 'deleted',
}

export interface Skills {
  health: number
  attack: number
  magic: number
  defense: number
}

export type Skill = 'health' | 'attack' | 'magic' | 'defense'
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
  private skills: Skills
  static readonly INITIAL_SKILL_POINTS_COUNT = 12
  static readonly INITIAL_HEALTH_POINTS_COUNT = 10

  constructor(
    readonly id: string,
    readonly name: string,
    private _skillPoints: number,
    health: number,
    attack: number,
    magic: number,
    defense: number,
    private _rank: number,
    private _recoveredAt: Date,
    private _status: CharacterStatus = CharacterStatus.LIVING,
    readonly ownerID: string | undefined
  ) {
    this.skills = { health, attack, magic, defense }

    this.guardStateIsValid()
  }

  toPrimitives(): CharacterProps {
    return {
      id: this.id,
      name: this.name,
      skillPoints: this._skillPoints,
      health: this.skills.health,
      magic: this.skills.magic,
      attack: this.skills.attack,
      defense: this.skills.defense,
      rank: this._rank,
      recoveredAt: this._recoveredAt,
      status: this._status,
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

  public incrementSkill(skill: Skill) {
    this.guardHasEnoughSkillPointsForIncrement(skill, this.skills[skill])
    const cost = this.calculateNextIncrementSkillCost(skill, this.skills[skill])

    this.skills = {
      ...this.skills,
      [skill]: this.skills[skill] + 1,
    }
    this._skillPoints -= cost
  }

  public get status(): CharacterStatus {
    return this._status
  }

  public set status(status: CharacterStatus) {
    this._status = status
  }

  private hasEnoughSkillPointsForIncrement(
    skill: string,
    skillCount: number
  ): boolean {
    const cost =
      skill === 'health'
        ? 1
        : this.calculateNextIncrementSkillCost(skill, skillCount)
    return this._skillPoints >= cost
  }

  private guardHasEnoughSkillPointsForIncrement(
    skill: string,
    skillCount: number
  ) {
    if (!this.hasEnoughSkillPointsForIncrement(skill, skillCount)) {
      throw new NotEnoughSkillPointsException()
    }
  }

  private guardStateIsValid() {
    if (this.totalCostOfSkills() > this.totalOfConsumedSkillPoints()) {
      throw new InvalidCharacterStateException()
    }
  }

  private totalCostOfSkills(): number {
    return (
      this.calculateTotalCostOfHealth() +
      this.calculateTotalSkillCost(this.skills.attack) +
      this.calculateTotalSkillCost(this.skills.magic) +
      this.calculateTotalSkillCost(this.skills.defense)
    )
  }

  private totalOfConsumedSkillPoints(): number {
    return Character.INITIAL_SKILL_POINTS_COUNT - this._skillPoints + this._rank
  }

  private calculateTotalCostOfHealth(): number {
    return this.skills.health - Character.INITIAL_HEALTH_POINTS_COUNT
  }

  private calculateTotalSkillCost(count: number): number {
    if (count === 0) return 0
    const cost = Math.max(Math.ceil((count - 1) / 5), 1)
    return count === 1 ? cost : cost + this.calculateTotalSkillCost(count - 1)
  }

  private calculateNextIncrementSkillCost(
    skill: string,
    skillCount: number
  ): number {
    if (skill === 'health') return 1
    return Math.max(Math.ceil(skillCount / 5), 1)
  }
}
