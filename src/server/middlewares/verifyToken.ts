import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export default function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1]
  if (token == null) return res.sendStatus(403)
  jwt.verify(
    token,
    process.env.SECRET_KEY as string,
    (err: Error | null, payload: any) => {
      if (err) return res.sendStatus(404)
      if (!payload) return res.sendStatus(400)

      req.currentUserId = payload.id
      next()
    }
  )
}
