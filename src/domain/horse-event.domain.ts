import type { Horse } from './horse.domain'

export enum HorseEventType {
  COLLECT = 'collect', // собрать
  DISASSEMBLE = 'disassemble', // разобрать
  WALK = 'walk', // выгулить
  CUSTOM = 'custom', // пользовательский тип
}

export interface HorseEvent {
  id: string | number
  horseId: Horse['id']
  type: HorseEventType
  name?: string
  time: string
  date: string
  completed: boolean
}
