import { makeAutoObservable } from 'mobx'
import { MobxMutation, MobxQuery } from 'mobx-tanstack-query'

import type { Task } from '@/domain/task.domain'

import { TasksService } from '@/services/tasks.service'
import { queryClient } from '@/presentation/core/react/query-client'

const TASKS_QUERY_KEY = 'tasks'

class TasksStore {
  // Запрос для получения всех задач
  tasksQuery = new MobxQuery<Task[], Error>({
    queryClient,
    queryKey: [TASKS_QUERY_KEY],
    queryFn: () => this.tasksService.findAll(),
  })

  // Мутация для добавления задачи
  addTaskMutation = new MobxMutation<Task[], Task, Error>({
    queryClient,
    mutationFn: task => this.tasksService.addTask(task),
    onSuccess: () => {
      // Инвалидируем кэш после успешного добавления
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] })
    },
  })

  // Мутация для обновления задачи
  updateTaskMutation = new MobxMutation<
    Task[],
    { id: Task['id'], task: Task },
    Error
  >({
    queryClient,
    mutationFn: ({ id, task }) => this.tasksService.updateTask(id, task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] })
    },
  })

  // Мутация для удаления задачи
  removeTaskMutation = new MobxMutation<Task[], Task['id'], Error>({
    queryClient,
    mutationFn: id => this.tasksService.removeTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] })
    },
  })

  constructor(private tasksService: TasksService) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  get tasks(): Task[] {
    return this.tasksQuery.result.data || []
  }

  // Поиск задачи по ID
  findById(id: Task['id']): Task | undefined {
    return this.tasks.find(task => task.id === id)
  }

  // Поиск задач по цвету
  findByColor(color: string): Task[] {
    return this.tasks.filter(task => task.color === color)
  }

  get loading(): boolean {
    return (
      this.tasksQuery.result.isLoading
      || this.addTaskMutation.result.isPending
      || this.updateTaskMutation.result.isPending
      || this.removeTaskMutation.result.isPending
    )
  }

  get error(): string | null {
    const error
      = this.tasksQuery.result.error
        || this.addTaskMutation.result.error
        || this.updateTaskMutation.result.error
        || this.removeTaskMutation.result.error

    return error ? error.message : null
  }

  // Публичные методы для работы с задачами
  addTask(task: Task) {
    this.addTaskMutation.mutate(task)
  }

  updateTask(id: Task['id'], task: Task) {
    this.updateTaskMutation.mutate({ id, task })
  }

  removeTask(id: Task['id']) {
    this.removeTaskMutation.mutate(id)
  }
}

// Инициализация store
export const tasksStore = new TasksStore(new TasksService())

