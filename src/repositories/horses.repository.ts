import type { NullableType } from '@/common'
import type { Horse } from '@/domain/horse.domain'

export interface IHorsesRepository {
  findAll: () => Promise<Horse[]>
  findOneById: (id: Horse['id']) => Promise<NullableType<Horse>>
  addHorse: (horse: Horse) => Promise<Horse[]>
  updateHorse: (id: Horse['id'], horse: Horse) => Promise<Horse[]>
  removeHorse: (id: Horse['id']) => Promise<Horse[]>
}
