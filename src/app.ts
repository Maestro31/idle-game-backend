import express, { json, urlencoded } from 'express'
import logger from 'morgan'

import indexRouter from './routes/index'
import usersRouter from './routes/users'

const app = express()

app.use(logger('dev'))
app.use(json())
app.use(urlencoded({ extended: false }))

app.use('/', indexRouter)
app.use('/users', usersRouter)

export default app
