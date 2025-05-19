import type { IStorage } from '@/domain/ports/storage'

import { LocalStorageService } from './local-storage.service'

export class StorageCleanerService {
  private readonly LAST_CLEANUP_KEY = 'lastStorageCleanupDate'
  private readonly CLEANUP_INTERVAL_DAYS = 7 // очистка раз в неделю
  private storage: IStorage

  constructor(storage?: IStorage) {
    this.storage = storage || new LocalStorageService()
  }

  /**
   * Проверяет необходимость очистки и выполняет её при необходимости
   * @returns boolean - была ли выполнена очистка
   */
  public checkAndCleanup(): boolean {
    if (this.shouldCleanup()) {
      this.performCleanup()
      this.updateLastCleanupDate()
      return true
    }
    return false
  }

  /**
   * Определяет, нужно ли выполнять очистку
   */
  private shouldCleanup(): boolean {
    const lastCleanupStr = this.storage.get(this.LAST_CLEANUP_KEY)

    if (!lastCleanupStr) {
      // Если очистка никогда не выполнялась, инициализируем дату
      this.updateLastCleanupDate()
      return false
    }

    const lastCleanup = new Date(lastCleanupStr)
    const now = new Date()

    // Проверяем, наступил ли понедельник с момента последней очистки
    return this.isMonday(now)
      && this.daysBetween(lastCleanup, now) >= this.CLEANUP_INTERVAL_DAYS
  }

  /**
   * Выполняет очистку хранилища
   */
  private performCleanup() {
    // Здесь реализуем стратегию очистки
    // Вариант 1: Архивируем старые данные (более недели)
    this.archiveOldData()

    // Вариант 2: Удаляем завершенные события старше определенной даты
    this.removeCompletedOldEvents()
  }

  /**
   * Архивирует старые данные
   */
  private archiveOldData() {
    // Получаем события
    const events = this.storage.getAsObject<any[]>('horseEvents')
    if (!events || events.length === 0)
      return

    // Получаем существующий архив или создаем новый
    const archive = this.storage.getAsObject<any[]>('eventsArchive') || []

    const now = new Date()
    const oneWeekAgo = new Date(now)
    oneWeekAgo.setDate(now.getDate() - 7)

    // Фильтруем события старше недели
    const oldEvents = events.filter((event) => {
      const eventDate = new Date(event.date)
      return eventDate < oneWeekAgo
    })

    // Добавляем старые события в архив
    if (oldEvents.length > 0) {
      this.storage.setObject('eventsArchive', [...archive, ...oldEvents])

      // Оставляем только недавние события
      const recentEvents = events.filter((event) => {
        const eventDate = new Date(event.date)
        return eventDate >= oneWeekAgo
      })

      this.storage.setObject('horseEvents', recentEvents)
    }
  }

  /**
   * Удаляет завершенные события старше определенного периода
   */
  private removeCompletedOldEvents() {
    const events = this.storage.getAsObject<any[]>('horseEvents')
    if (!events || events.length === 0)
      return

    const twoWeeksAgo = new Date()
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)

    // Удаляем завершенные события старше двух недель
    const filteredEvents = events.filter((event) => {
      const eventDate = new Date(event.date)
      // Оставляем все незавершенные события или завершенные, но недавние
      return !event.completed || (event.completed && eventDate >= twoWeeksAgo)
    })

    if (filteredEvents.length !== events.length) {
      this.storage.setObject('horseEvents', filteredEvents)
    }
  }

  /**
   * Обновляет дату последней очистки
   */
  private updateLastCleanupDate() {
    const now = new Date()
    this.storage.setPrimitive(this.LAST_CLEANUP_KEY, now.toISOString())
  }

  /**
   * Проверяет, является ли дата понедельником
   */
  private isMonday(date: Date): boolean {
    return date.getDay() === 1 // 0 - воскресенье, 1 - понедельник
  }

  /**
   * Вычисляет количество дней между двумя датами
   */
  private daysBetween(d1: Date, d2: Date): number {
    const oneDay = 24 * 60 * 60 * 1000 // миллисекунды в одном дне
    const diffTime = Math.abs(d2.getTime() - d1.getTime())
    return Math.round(diffTime / oneDay)
  }

  /**
   * Принудительная очистка данных (может вызываться из настроек приложения)
   */
  public forceCleanup() {
    this.performCleanup()
    this.updateLastCleanupDate()
  }
}
