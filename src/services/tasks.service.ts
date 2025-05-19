import type { Task } from '@/domain/task.domain'
import type { IStorage } from '@/domain/ports/storage'
import type { ITasksRepository } from '@/repositories/tasks.repository'

import { returnAfterDelay } from '@/common'

import { LocalStorageService } from './local-storage.service'

interface TasksStorage {
  tasks: Task[]
}

export class TasksService implements ITasksRepository {
  private readonly TASKS_KEY: string = 'tasks'
  storage: IStorage = new LocalStorageService()

  private getTasks(): Task[] {
    const storage = this.storage.getAsObject<TasksStorage>(this.TASKS_KEY)
    return storage.tasks || []
  }

  private saveTasks(tasks: Task[]): void {
    this.storage.setObject(this.TASKS_KEY, { tasks })
  }

  findAll() {
    const tasks = this.getTasks()
    return returnAfterDelay(tasks)
  }

  addTask(task: Task) {
    const tasks = this.getTasks()
    this.saveTasks([...tasks, task])
    return returnAfterDelay([...tasks, task])
  }

  updateTask(id: Task['id'], task: Task) {
    const tasks = this.getTasks()
    const updatedTasks = tasks.map(t => t.id === id ? { ...t, ...task } : t)
    this.saveTasks(updatedTasks)
    return returnAfterDelay(updatedTasks)
  }

  removeTask(id: Task['id']) {
    const tasks = this.getTasks()
    const filteredTasks = tasks.filter(t => t.id !== id)
    this.saveTasks(filteredTasks)
    return returnAfterDelay(filteredTasks)
  }
}
