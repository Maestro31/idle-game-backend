import AssaultLogDTO from '../../../game/game-logger/AssaultLog'
import { RandomInterface } from '../../../game/services/RandomInterface'
import CommandHandler from '../../../shared/domain/command/CommandHandler'
import DateProviderInterface from '../../../shared/services/DateProviderInterface'
import UniqueIdAdapterInterface from '../../../shared/services/UniqueIdAdapterInterface'
import Battle from '../Battle'
import FighterNotFoundException from '../exceptions/FighterNotFoundException'
import Fighter from '../Fighter'
import BattleRunner from '../infra/services/BattleRunner'
import BattleRepositoryInterface from '../repositories/BattleRepositoryInterface'
import OpponentSelectorInterface from '../services/OpponentSelectorInterface'
import CreateBattleCommand from './CreateBattleCommand'

export default class CreateBattleCommandHandler
  implements CommandHandler<CreateBattleCommand, Promise<void>>
{
  constructor(
    private battleRepository: BattleRepositoryInterface,
    private uniqueIdAdapter: UniqueIdAdapterInterface,
    private opponentSelector: OpponentSelectorInterface,
    private randomService: RandomInterface,
    private dateProvider: DateProviderInterface
  ) {}

  async execute({ characterID }: CreateBattleCommand): Promise<void> {
    const fighterOfPlayer = await this.findFighterOfPlayer(characterID)
    const opponent = await this.opponentSelector.to(fighterOfPlayer)

    const battle = new Battle(
      this.uniqueIdAdapter.generate(),
      fighterOfPlayer,
      opponent,
      this.dateProvider
    )

    battle.run(new BattleRunner(this.randomService))

    await this.battleRepository.save(battle)
  }

  private async findFighterOfPlayer(characterID: string): Promise<Fighter> {
    const fighterOfPlayer = await this.battleRepository.findFighter(characterID)
    if (!fighterOfPlayer) throw new FighterNotFoundException()
    return fighterOfPlayer
  }

  private onAssaultLogCreated(assaultLog: AssaultLogDTO) {}
}
