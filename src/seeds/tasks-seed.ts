import type { Task } from '@/domain/task.domain'

import { tasksStore } from '@/stores/tasks.store'

// Дефолтные задачи, которые нужно создать при первом запуске приложения
const DEFAULT_TASKS: Task[] = [
  {
    id: 'default-collect',
    title: 'Собрать',
    color: '#1976d2', // синий
  },
  {
    id: 'default-disassemble',
    title: 'Разобрать',
    color: '#ed6c02', // оранжевый
  },
  {
    id: 'default-walk',
    title: 'Выгулить',
    color: '#2e7d32', // зеленый
  },
]

export async function loadDefaultTasks(): Promise<void> {
  // Проверим, есть ли уже какие-то задачи в хранилище
  const existingTasks = await tasksStore.tasksQuery.result.data

  // Если задач нет, добавляем дефолтные
  if (!existingTasks || existingTasks.length === 0) {
    console.log('Инициализация дефолтных задач...')

    // Последовательно добавляем дефолтные задачи
    for (const task of DEFAULT_TASKS) {
      await tasksStore.addTask(task)
    }

    console.log('Дефолтные задачи созданы')
  }
}
