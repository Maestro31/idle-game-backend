declare namespace Express {
  export interface Request {
    currentUserId: string
  }
}

declare module '*.json' {
  const value: any
  export default value
}
