export interface FighterProps {
  id: string
  name: string
  skillPoints: number
  attack: number
  magic: number
  defense: number
  health: number
  rank: number
  ownerID?: string
}

export interface FighterSkills {
  attack: number
  magic: number
  defense: number
  health: number
}

export type FighterSkill = 'attack' | 'magic' | 'defense'

export default class Fighter {
  private skills: FighterSkills

  constructor(
    readonly id: string,
    readonly name: string,
    private skillPoints: number,
    protected health: number,
    protected attack: number,
    protected magic: number,
    protected defense: number,
    private _rank: number,
    private _recoveredAt: Date,
    readonly ownerID?: string
  ) {
    this.skills = { attack, magic, defense, health }
  }

  get rank() {
    return this._rank
  }

  get recoveredAt() {
    return this._recoveredAt
  }

  set recoveredAt(recoveredAt: Date) {
    this._recoveredAt = recoveredAt
  }

  canWin(fighter: Fighter): boolean {
    return this.attack > fighter.defense
  }

  incrementRank() {
    this._rank += 1
  }

  incrementSkillPoints() {
    this.skillPoints += 1
  }

  toPrimitives(): FighterProps {
    return {
      id: this.id,
      name: this.name,
      skillPoints: this.skillPoints,
      rank: this.rank,
      ...this.skills,
      ownerID: this.ownerID,
    }
  }
}
