export default interface HasherAdapterInterface {
  hash(password: string): string
  compare(password: string, hash: string): Promise<boolean>
}
