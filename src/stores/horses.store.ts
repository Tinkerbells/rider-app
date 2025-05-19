import { makeAutoObservable } from 'mobx'
import { MobxMutation, MobxQuery } from 'mobx-tanstack-query'

import type { Horse } from '@/domain/horse.domain'

import { HorsesService } from '@/services/horses.service'
import { queryClient } from '@/presentation/core/react/query-client'

const HORSES_QUERY_KEY = 'horses'

class HorsesStore {
  // Запрос для получения всех лошадей
  horsesQuery = new MobxQuery<Horse[], Error>({
    queryClient,
    queryKey: [HORSES_QUERY_KEY],
    queryFn: () => this.horsesService.findAll(),
  })

  // Мутация для добавления лошади
  addHorseMutation = new MobxMutation<Horse[], Horse, Error>({
    queryClient,
    mutationFn: horse => this.horsesService.addHorse(horse),
    onSuccess: () => {
      // Инвалидируем кэш после успешного добавления
      queryClient.invalidateQueries({ queryKey: [HORSES_QUERY_KEY] })
    },
  })

  // Мутация для обновления лошади
  updateHorseMutation = new MobxMutation<
    Horse[],
    { id: Horse['id'], horse: Horse },
    Error
  >({
    queryClient,
    mutationFn: ({ id, horse }) => this.horsesService.updateHorse(id, horse),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [HORSES_QUERY_KEY] })
    },
  })

  // Мутация для удаления лошади
  removeHorseMutation = new MobxMutation<Horse[], Horse['id'], Error>({
    queryClient,
    mutationFn: id => this.horsesService.removeHorse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [HORSES_QUERY_KEY] })
    },
  })

  constructor(private horsesService: HorsesService) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  get horses(): Horse[] {
    return this.horsesQuery.result.data || []
  }

  findById(id: Horse['id']): Horse {
    return this.horsesQuery.result.data 
  }

  get loading(): boolean {
    return (
      this.horsesQuery.result.isLoading
      || this.addHorseMutation.result.isPending
      || this.updateHorseMutation.result.isPending
      || this.removeHorseMutation.result.isPending
    )
  }

  get error(): string | null {
    const error
      = this.horsesQuery.result.error
        || this.addHorseMutation.result.error
        || this.updateHorseMutation.result.error
        || this.removeHorseMutation.result.error

    return error ? error.message : null
  }

  // Публичные методы для работы с лошадьми
  addHorse(horse: Horse) {
    this.addHorseMutation.mutate(horse)
  }

  updateHorse(id: Horse['id'], horse: Horse) {
    this.updateHorseMutation.mutate({ id, horse })
  }

  removeHorse(id: Horse['id']) {
    this.removeHorseMutation.mutate(id)
  }
}

// Initialize the store
export const horsesStore = new HorsesStore(new HorsesService())
