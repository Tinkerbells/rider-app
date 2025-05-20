import type { Task } from './task.domain'
import type { Horse } from './horse.domain'

export interface HorseEvent {
  id: string | number
  horseId: Horse['id']
  tasksIds: Task['id'][]
  time: string
  date: string
  completed: boolean
}
