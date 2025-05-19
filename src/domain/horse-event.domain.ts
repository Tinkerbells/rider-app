import type { Task } from './task.domain'
import type { Horse } from './horse.domain'

export interface HorseEvent {
  id: string | number
  horse: Horse
  tasks: Task[]
  name?: string
  time: string
  date: string
  completed: boolean
}
