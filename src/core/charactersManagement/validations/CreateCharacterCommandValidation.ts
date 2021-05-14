import guardIsNotEmpty from '../../../shared/domain/guards/isNotEmpty'
import CreateCharacterCommand from '../commands/CreateCharacterCommand'

export default class CreateCharacterCommandValidation {
  static validate(payload: CreateCharacterCommand) {
    Object.entries(payload).forEach((entry) =>
      guardIsNotEmpty(entry[1], entry[0])
    )
  }
}
