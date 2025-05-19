import type { Horse } from '@/domain/horse.domain'
import type { IStorage } from '@/domain/ports/storage'
import type { IHorsesRepository } from '@/repositories/horses.repository'

import { returnAfterDelay } from '@/common'

import { LocalStorageService } from './local-storage.service'

export class HorsesService implements IHorsesRepository {
  private readonly HORSES_KEY: string = 'horses'
  storage: IStorage = new LocalStorageService()
  findAll() {
    const horses = this.storage.getAsObject<Horse[]>(this.HORSES_KEY)
    return returnAfterDelay(horses)
  }

  addHorse(horse: Horse) {
    const horses = this.storage.getAsObject<Horse[]>(this.HORSES_KEY)
    this.storage.setObject(this.HORSES_KEY, [...horses, horse])
    return returnAfterDelay([...horses, horse])
  }

  updateHorse(id: Horse['id'], horse: Horse) {
    const horses = this.storage.getAsObject<Horse[]>(this.HORSES_KEY)
    const updatedHorses = horses.map(h => h.id === id ? { ...h, ...horse } : h)
    this.storage.setObject(this.HORSES_KEY, updatedHorses)
    return returnAfterDelay(updatedHorses)
  }

  removeHorse(id: Horse['id']) {
    const horses = this.storage.getAsObject<Horse[]>(this.HORSES_KEY)
    const filteredHorses = horses.filter(h => h.id !== id)
    this.storage.setObject(this.HORSES_KEY, filteredHorses)
    return returnAfterDelay(filteredHorses)
  }
}
