export default interface CommandHandler<T, U> {
  execute(payload: T): U
}
