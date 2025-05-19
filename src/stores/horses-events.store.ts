import { makeAutoObservable, runInAction } from 'mobx'

import type { HorseEvent } from '@/domain/horse-event.domain'

import { HorsesEventsService } from '@/services/horses-events.service'

class HorseEventsStore {
  events: HorseEvent[] = []
  filteredEvents: HorseEvent[] = []
  loading = false
  error: string | null = null
  selectedDate: string = new Date().toISOString().split('T')[0] // Today's date in YYYY-MM-DD format

  constructor(private eventsService: HorsesEventsService) {
    makeAutoObservable(this)
    this.loadEvents()
  }

  setSelectedDate(date: string) {
    this.selectedDate = date
    this.filterEventsByDate()
  }

  filterEventsByDate() {
    this.filteredEvents = this.events.filter(event => event.date === this.selectedDate)
  }

  async loadEvents() {
    this.loading = true
    this.error = null

    try {
      const events = await this.eventsService.findAll()
      runInAction(() => {
        this.events = events
        this.filterEventsByDate()
        this.loading = false
      })
    }
    catch (error) {
      runInAction(() => {
        this.error = (error as Error).message
        this.loading = false
      })
    }
  }

  async addEvent(event: HorseEvent) {
    this.loading = true
    this.error = null

    try {
      const updatedEvents = await this.eventsService.addEvent(event)
      runInAction(() => {
        this.events = updatedEvents
        this.filterEventsByDate()
        this.loading = false
      })
    }
    catch (error) {
      runInAction(() => {
        this.error = (error as Error).message
        this.loading = false
      })
    }
  }

  async updateEvent(id: HorseEvent['id'], eventUpdate: Partial<HorseEvent>) {
    this.loading = true
    this.error = null

    try {
      const updatedEvents = await this.eventsService.updateEvent(id, eventUpdate)
      runInAction(() => {
        this.events = updatedEvents
        this.filterEventsByDate()
        this.loading = false
      })
    }
    catch (error) {
      runInAction(() => {
        this.error = (error as Error).message
        this.loading = false
      })
    }
  }

  async removeEvent(id: HorseEvent['id']) {
    this.loading = true
    this.error = null

    try {
      const updatedEvents = await this.eventsService.removeEvent(id)
      runInAction(() => {
        this.events = updatedEvents
        this.filterEventsByDate()
        this.loading = false
      })
    }
    catch (error) {
      runInAction(() => {
        this.error = (error as Error).message
        this.loading = false
      })
    }
  }

  async toggleEventCompleted(id: HorseEvent['id']) {
    this.loading = true
    this.error = null

    try {
      const updatedEvents = await this.eventsService.toggleCompleted(id)
      runInAction(() => {
        this.events = updatedEvents
        this.filterEventsByDate()
        this.loading = false
      })
    }
    catch (error) {
      runInAction(() => {
        this.error = (error as Error).message
        this.loading = false
      })
    }
  }

  // Get events grouped by time
  get eventsByTime() {
    const groupedEvents: { [time: string]: HorseEvent[] } = {}

    this.filteredEvents.forEach((event) => {
      if (!groupedEvents[event.time]) {
        groupedEvents[event.time] = []
      }
      groupedEvents[event.time].push(event)
    })

    // Convert to array and sort by time
    return Object.entries(groupedEvents)
      .sort(([timeA], [timeB]) => timeA.localeCompare(timeB))
      .map(([time, events]) => ({ time, events }))
  }
}

// Initialize the store

export const horseEventsStore = new HorseEventsStore(new HorsesEventsService())
