import type { Horse } from './horse.domain'

export enum HorseEventTasks {
  COLLECT = 'collect', // собрать
  DISASSEMBLE = 'disassemble', // разобрать
  WALK = 'walk', // выгулить
  CUSTOM = 'custom', // пользовательский тип
}

export interface HorseEvent {
  id: string | number
  horse: Horse
  tasks: HorseEventTasks[]
  name?: string
  time: string
  date: string
  completed: boolean
}
