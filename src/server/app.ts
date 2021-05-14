import express, { json, urlencoded } from 'express'
import logger from 'morgan'

import indexRouter from './routes/index'
import usersRouter from './routes/users'
import charactersRouter from './routes/characters'
import battleRouter from './routes/battle'

import dotenv from 'dotenv'

if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

const app = express()

if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'))
}

app.use(json())
app.use(urlencoded({ extended: false }))

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/characters', charactersRouter)
app.use('/battle', battleRouter)

export default app
