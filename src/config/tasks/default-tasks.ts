import type { Task } from '@/domain/task.domain'

export const DEFAULT_TASKS: Task[] = [
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
