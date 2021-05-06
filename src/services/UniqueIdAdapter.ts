import UniqueIdAdapterInterface from '../shared/services/UniqueIdAdapterInterface'
import { v4 as uuid } from 'uuid'

export default class UniqueIdAdapter implements UniqueIdAdapterInterface {
  generate(): string {
    return uuid()
  }
}
