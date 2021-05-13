import User from '../User'

export default class UserValidator {
  validate(user: User): void {
    this.guardIsNotEmpty(user.firstname, 'firstname')
    this.guardIsNotEmpty(user.lastname, 'lastname')
    this.guardIsNotEmpty(user.email, 'email')
    this.guardIsNotEmpty(user.hashedPassword, 'password')
    this.guardEmailHasInvalidFormat(user.email, 'email')
  }

  private guardIsNotEmpty(field: string, fieldName: string) {
    if (field === '' || field === null) {
      throw new Error(`Field ${fieldName} could not be empty`)
    }
  }

  private guardEmailHasInvalidFormat(field: string, fieldName: string) {
    const REGEXP_EMAIL = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!REGEXP_EMAIL.test(String(field).toLowerCase())) {
      throw new Error(`Field ${fieldName} has invalid format`)
    }
  }
}
