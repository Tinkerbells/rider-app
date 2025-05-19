import type { Task } from '@/domain/task.domain'

export interface ITasksRepository {
  findAll: () => Promise<Task[]>
  addTask: (horse: Task) => Promise<Task[]>
  updateTask: (id: Task['id'], task: Task) => Promise<Task[]>
  removeTask: (id: Task['id']) => Promise<Task[]>
}
