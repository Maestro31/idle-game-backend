interface UserProps {
  id: string
  firstname: string
  lastname: string
  email: string
  hashedPassword: string
}

export default class User {
  constructor(
    readonly id: string,
    readonly firstname: string,
    readonly lastname: string,
    readonly email: string,
    readonly hashedPassword: string
  ) {}

  static fromPrimitives(props: UserProps) {
    return new User(
      props.id,
      props.firstname,
      props.lastname,
      props.email,
      props.hashedPassword
    )
  }

  toPrimitives(): UserProps {
    return {
      id: this.id,
      firstname: this.firstname,
      lastname: this.lastname,
      email: this.email,
      hashedPassword: this.hashedPassword,
    }
  }
}
