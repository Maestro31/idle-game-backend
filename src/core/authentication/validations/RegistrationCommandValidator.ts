import guardIsNotEmpty from '../../../shared/domain/guards/isNotEmpty'
import RegistrationCommand from '../commands/RegistrationCommand'

export default class RegistrationCommandValidator {
  static validate(payload: RegistrationCommand) {
    guardIsNotEmpty(payload.firstname, 'firstname')
    guardIsNotEmpty(payload.lastname, 'lastname')
    guardIsNotEmpty(payload.email, 'email')
    guardIsNotEmpty(payload.password, 'password')
    this.guardEmailHasInvalidFormat(payload.email, 'email')
  }

  private static guardEmailHasInvalidFormat(field: string, fieldName: string) {
    const REGEXP_EMAIL =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!REGEXP_EMAIL.test(String(field).toLowerCase())) {
      throw new Error(`Field ${fieldName} has invalid format`)
    }
  }
}
