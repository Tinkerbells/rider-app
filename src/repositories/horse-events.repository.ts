import type { Horse } from '@/domain/horse.domain'
import type { HorseEvent } from '@/domain/horse-event.domain'

export interface IHorsesEventsRepository {
  findAll: () => Promise<HorseEvent[]>
  findByDate: (date: string) => Promise<HorseEvent[]>
  findByHorse: (horseId: Horse['id']) => Promise<HorseEvent[]>
  addEvent: (event: HorseEvent) => Promise<HorseEvent[]>
  updateEvent: (id: HorseEvent['id'], event: Partial<HorseEvent>) => Promise<HorseEvent[]>
  removeEvent: (id: HorseEvent['id']) => Promise<HorseEvent[]>
  toggleCompleted: (id: HorseEvent['id']) => Promise<HorseEvent[]>
}
