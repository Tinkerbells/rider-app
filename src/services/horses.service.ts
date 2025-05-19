import type { Horse } from '@/domain/horse.domain'
import type { IStorage } from '@/domain/ports/storage'
import type { IHorsesRepository } from '@/repositories/horses.repository'

import { returnAfterDelay } from '@/common'

import { LocalStorageService } from './local-storage.service'

interface HorsesStorage {
  horses: Horse[]
}

export class HorsesService implements IHorsesRepository {
  private readonly HORSES_KEY: string = 'horses'
  storage: IStorage = new LocalStorageService()

  private getHorses(): Horse[] {
    const storage = this.storage.getAsObject<HorsesStorage>(this.HORSES_KEY)
    return storage.horses || []
  }

  private saveHorses(horses: Horse[]): void {
    this.storage.setObject(this.HORSES_KEY, { horses })
  }

  findAll() {
    const horses = this.getHorses()
    return returnAfterDelay(horses)
  }

  addHorse(horse: Horse) {
    const horses = this.getHorses()
    this.saveHorses([...horses, horse])
    return returnAfterDelay([...horses, horse])
  }

  updateHorse(id: Horse['id'], horse: Horse) {
    const horses = this.getHorses()
    const updatedHorses = horses.map(h => h.id === id ? { ...h, ...horse } : h)
    this.saveHorses(updatedHorses)
    return returnAfterDelay(updatedHorses)
  }

  removeHorse(id: Horse['id']) {
    const horses = this.getHorses()
    const filteredHorses = horses.filter(h => h.id !== id)
    this.saveHorses(filteredHorses)
    return returnAfterDelay(filteredHorses)
  }
}
