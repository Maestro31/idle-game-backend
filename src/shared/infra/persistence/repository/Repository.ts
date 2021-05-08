export default interface Repository<T> {
  save(model: T): Promise<void>
  findAll(): Promise<T[]>
  findById(id: string): Promise<T | null>
  exists(model: T): Promise<boolean>
}
