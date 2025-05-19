import type { Task } from './task.domain'
import type { Horse } from './horse.domain'

export interface HorseEvent {
  id: string | number
  horse: Horse['id']
  tasks: Task['id'][]
  name?: string
  time: string
  date: string
  completed: boolean
}
