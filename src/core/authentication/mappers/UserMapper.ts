import User from '../User'

export default class UserMapper {
  static toPersistence(user: User): any {
    return {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      hashedPassword: user.hashedPassword,
    }
  }

  static toDomain(raw: any): User {
    return User.fromPrimitives({
      id: raw.id,
      firstname: raw.firstname,
      lastname: raw.lastname,
      email: raw.email,
      hashedPassword: raw.hashedPassword,
    })
  }
}
