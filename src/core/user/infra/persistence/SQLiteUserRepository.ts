import database from '../../../../infra/persistence/database'
import UserRepositoryInterface from '../../repository/UserRepositoryInterface'
import User from '../../User'

export default class SQLiteUserRepository implements UserRepositoryInterface {
  async save(user: User): Promise<void> {
    return new Promise((resolve, reject) => {
      const { id, firstname, lastname, email, hashedPassword } = user
      const params = [id, firstname, lastname, email, hashedPassword]

      database.run(
        'INSERT INTO users (domainID, firstname, lastname, email, hashedPassword) values (?,?,?,?,?)',
        params,
        (err: Error | null) => {
          if (err) return reject(err)
          resolve()
        }
      )
    })
  }

  async findAll(): Promise<User[]> {
    return new Promise((resolve, reject) => {
      database.all('SELECT * FROM users', (err: Error | null, rows) => {
        if (err) return reject(err)
        const users = rows.map((row) => this.mapUser(row))
        return resolve(users)
      })
    })
  }

  async userExists(email: string): Promise<boolean> {
    const user = await this.findByEmail(email)
    return user !== null
  }

  async findByEmail(email: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
      database.get(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (err, row) => {
          if (err) return reject(err)
          if (!row) return resolve(null)

          return resolve(this.mapUser(row))
        }
      )
    })
  }

  async findById(id: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
      database.get(
        'SELECT * FROM users WHERE domainID = ?',
        [id],
        (err, row) => {
          if (err) return reject(err)
          if (!row) return resolve(null)

          return resolve(this.mapUser(row))
        }
      )
    })
  }

  mapUser(row: any) {
    return User.fromPrimitives({
      id: row.domainID,
      firstname: row.firstname,
      lastname: row.lastname,
      email: row.email,
      hashedPassword: row.hashedPassword,
    })
  }
}
