import sqlite3 from 'sqlite3'

const database = new sqlite3.Database('db.sqlite', (err) => {
  if (err) {
    return console.error(err.message)
  }
  console.log('Connected to the SQlite database.')
})

database.run(
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY_KEY,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    hashedPassword TEXT NOT NULL,
    domainID TEXT NOT NULL
  )
`,
  (err: Error | null) => {
    if (err) return console.error(err.message)
  }
)

database.run(
  `CREATE TABLE IF NOT EXISTS characters (
    id INTEGER PRIMARY_KEY,
    name TEXT NOT NULL,
    skillPoints INTEGER NOT NULL DEFAULT 0,
    health INTEGER NOT NULL DEFAULT 0,
    attack INTEGER NOT NULL DEFAULT 0,
    magic INTEGER NOT NULL DEFAULT 0,
    defense INTEGER NOT NULL DEFAULT 0,
    rank INTEGER NOT NULL DEFAULT 0,
    recoveredAt TEXT NOT NULL,
    domainID TEXT NOT NULL,
    ownerID TEXT NOT NULL
  )
`,
  (err: Error | null) => {
    if (err) return console.error(err.message)
  }
)

export default database
