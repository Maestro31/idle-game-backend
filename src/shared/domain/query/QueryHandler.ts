export default interface QueryHandler<T, U> {
  execute(payload: T): U
}
