import { makeAutoObservable } from 'mobx'
import { MobxMutation, MobxQuery } from 'mobx-tanstack-query'

import type { HorseEvent } from '@/domain/horse-event.domain'

import { queryClient } from '@/presentation/core/react/query-client'
import { HorsesEventsService } from '@/services/horses-events.service'

const EVENTS_QUERY_KEY = 'horse-events'

class HorseEventsStore {
  selectedDate: string = new Date().toISOString().split('T')[0]

  // Запрос для получения всех событий
  eventsQuery = new MobxQuery<HorseEvent[], Error>({
    queryClient,
    queryKey: [EVENTS_QUERY_KEY],
    queryFn: () => this.eventsService.findAll(),
  })

  // Мутация для добавления события
  addEventMutation = new MobxMutation<HorseEvent[], HorseEvent, Error>({
    queryClient,
    mutationFn: event => this.eventsService.addEvent(event),
    onSuccess: () => {
      // Инвалидируем кэш после успешного добавления
      queryClient.invalidateQueries({ queryKey: [EVENTS_QUERY_KEY] })
    },
  })

  // Мутация для обновления события
  updateEventMutation = new MobxMutation<
    HorseEvent[],
    { id: HorseEvent['id'], event: Partial<HorseEvent> },
    Error
  >({
    queryClient,
    mutationFn: ({ id, event }) => this.eventsService.updateEvent(id, event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EVENTS_QUERY_KEY] })
    },
  })

  // Мутация для удаления события
  removeEventMutation = new MobxMutation<HorseEvent[], HorseEvent['id'], Error>({
    queryClient,
    mutationFn: id => this.eventsService.removeEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EVENTS_QUERY_KEY] })
    },
  })

  // Мутация для переключения статуса "выполнено"
  toggleCompletedMutation = new MobxMutation<HorseEvent[], HorseEvent['id'], Error>({
    queryClient,
    mutationFn: id => this.eventsService.toggleCompleted(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EVENTS_QUERY_KEY] })
      // Здесь не показываем уведомление, чтобы не раздражать пользователя
    },
  })

  constructor(private eventsService: HorsesEventsService) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  setSelectedDate(date: string) {
    this.selectedDate = date
  }

  get events(): HorseEvent[] {
    return this.eventsQuery.result.data || []
  }

  // Получение событий, отфильтрованных по выбранной дате
  get filteredEvents(): HorseEvent[] {
    return this.events.filter(event => event.date === this.selectedDate)
  }

  get loading(): boolean {
    return (
      this.eventsQuery.result.isLoading
      || this.addEventMutation.result.isPending
      || this.updateEventMutation.result.isPending
      || this.removeEventMutation.result.isPending
      || this.toggleCompletedMutation.result.isPending
    )
  }

  // Данные с ошибкой
  get error(): string | null {
    const error
      = this.eventsQuery.result.error
        || this.addEventMutation.result.error
        || this.updateEventMutation.result.error
        || this.removeEventMutation.result.error
        || this.toggleCompletedMutation.result.error

    return error ? error.message : null
  }

  // Публичные методы для работы с событиями
  addEvent(event: HorseEvent) {
    this.addEventMutation.mutate(event)
  }

  updateEvent(id: HorseEvent['id'], event: Partial<HorseEvent>) {
    this.updateEventMutation.mutate({ id, event })
  }

  removeEvent(id: HorseEvent['id']) {
    this.removeEventMutation.mutate(id)
  }

  toggleEventCompleted(id: HorseEvent['id']) {
    this.toggleCompletedMutation.mutate(id)
  }

  // Группировка событий по времени для отображения в UI
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
