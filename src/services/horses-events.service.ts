import type { Horse } from '@/domain/horse.domain'
import type { IStorage } from '@/domain/ports/storage'
import type { HorseEvent } from '@/domain/horse-event.domain'
import type { IHorsesEventsRepository } from '@/repositories/horse-events.repository'

import { returnAfterDelay } from '@/common'

import { LocalStorageService } from './local-storage.service'

interface EventsStorage {
  events: HorseEvent[]
}

export class HorsesEventsService implements IHorsesEventsRepository {
  private readonly EVENTS_KEY: string = 'events'
  storage: IStorage = new LocalStorageService()

  private getEvents(): HorseEvent[] {
    const storage = this.storage.getAsObject<EventsStorage>(this.EVENTS_KEY)
    return storage.events || []
  }

  private saveEvents(events: HorseEvent[]): void {
    this.storage.setObject(this.EVENTS_KEY, { events })
  }

  findAll() {
    const events = this.getEvents()
    return returnAfterDelay(events)
  }

  findByDate(date: string) {
    const events = this.getEvents()
    const filteredEvents = events.filter(event => event.date === date)
    return returnAfterDelay(filteredEvents)
  }

  findByHorse(horseId: Horse['id']) {
    const events = this.getEvents()
    const filteredEvents = events.filter(event => event.horseId === horseId)
    return returnAfterDelay(filteredEvents)
  }

  addEvent(event: HorseEvent) {
    const events = this.getEvents()
    // Генерируем ID, если он не предоставлен
    if (!event.id) {
      event.id = Date.now().toString()
    }
    const newEvents = [...events, event]
    this.saveEvents(newEvents)
    return returnAfterDelay(newEvents)
  }

  updateEvent(id: HorseEvent['id'], eventUpdate: Partial<HorseEvent>) {
    const events = this.getEvents()
    const updatedEvents = events.map(e =>
      e.id === id ? { ...e, ...eventUpdate } : e,
    )
    this.saveEvents(updatedEvents)
    return returnAfterDelay(updatedEvents)
  }

  removeEvent(id: HorseEvent['id']) {
    const events = this.getEvents()
    const filteredEvents = events.filter(e => e.id !== id)
    this.saveEvents(filteredEvents)
    return returnAfterDelay(filteredEvents)
  }

  toggleCompleted(id: HorseEvent['id']) {
    const events = this.getEvents()
    const updatedEvents = events.map((e) => {
      if (e.id === id) {
        return { ...e, completed: !e.completed }
      }
      return e
    })
    this.saveEvents(updatedEvents)
    return returnAfterDelay(updatedEvents)
  }

  // Дополнительные полезные методы
  findByDateRange(startDate: string, endDate: string) {
    const events = this.getEvents()
    const filteredEvents = events.filter(event =>
      event.date >= startDate && event.date <= endDate,
    )
    return returnAfterDelay(filteredEvents)
  }
}
