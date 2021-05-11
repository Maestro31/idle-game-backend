export interface FighterProps {
  id: string
  name: string
  skillPoints: number
  attack: number
  magic: number
  defense: number
  health: number
  rank: number
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
    health: number,
    attack: number,
    magic: number,
    defense: number,
    private rank: number,
    private _recoveredAt: Date
  ) {
    this.skills = { attack, magic, defense, health }
  }

  get recoveredAt() {
    return this._recoveredAt
  }

  set recoveredAt(recoveredAt: Date) {
    this._recoveredAt = recoveredAt
  }

  incrementRank() {
    this.rank += 1
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
    }
  }
}
