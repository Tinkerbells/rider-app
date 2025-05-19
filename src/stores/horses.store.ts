import { makeAutoObservable, runInAction } from 'mobx'

import type { Horse } from '@/domain/horse.domain'

import { HorsesService } from '@/services/horses.service'

class HorsesStore {
  horses: Horse[] = []
  loading = false
  error: string | null = null

  constructor(private horsesService: HorsesService) {
    makeAutoObservable(this)
    this.loadHorses()
  }

  async loadHorses() {
    this.loading = true
    this.error = null

    try {
      const horses = await this.horsesService.findAll()
      runInAction(() => {
        this.horses = horses
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

  async addHorse(horse: Horse) {
    this.loading = true
    this.error = null

    try {
      const updatedHorses = await this.horsesService.addHorse(horse)
      runInAction(() => {
        this.horses = updatedHorses
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

  async updateHorse(id: Horse['id'], updatedHorse: Horse) {
    this.loading = true
    this.error = null

    try {
      const updatedHorses = await this.horsesService.updateHorse(id, updatedHorse)
      runInAction(() => {
        this.horses = updatedHorses
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

  async removeHorse(id: Horse['id']) {
    this.loading = true
    this.error = null

    try {
      const updatedHorses = await this.horsesService.removeHorse(id)
      runInAction(() => {
        this.horses = updatedHorses
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
}

// Initialize the store
export const horsesStore = new HorsesStore(new HorsesService())
