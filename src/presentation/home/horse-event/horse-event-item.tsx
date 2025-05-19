import { observer } from 'mobx-react-lite'
import { Box, Checkbox, Paper, Typography } from '@mui/material'

import type { Horse } from '@/domain/horse.domain'
import type { HorseEvent } from '@/domain/horse-event.domain'

import './horse-event-item.css'

import { horseEventsStore, horsesStore } from '@/stores'

interface HorseEventItemProps {
  event: HorseEvent
}

export const HorseEventItem = observer(({ event }: HorseEventItemProps) => {
  const { toggleEventCompleted } = horseEventsStore
  const { horses } = horsesStore

  const horse = horses.find(h => h.id === event.horseId) || { name: 'Неизвестная лошадь' } as Horse

  const getEventTypeText = (type: string): string => {
    switch (type) {
      case 'collect': return 'Собрать'
      case 'disassemble': return 'Разобрать'
      case 'walk': return 'Выгулить'
      default: return type
    }
  }

  const handleToggleComplete = () => {
    toggleEventCompleted(event.id)
  }

  return (
    <Paper className="event-item">
      <Box className="event-item__horse">
        <img
          src={`/assets/png2svg/horse${Number(event.horseId) % 3 + 1}.svg`}
          alt={horse.name}
          className="event-item__horse-icon"
        />
        <Typography variant="body2">{horse.name}</Typography>
      </Box>

      <Typography variant="body1" className="event-item__action">
        {getEventTypeText(event.type)}
      </Typography>

      <Checkbox
        checked={event.completed}
        onChange={handleToggleComplete}
        className="event-item__checkbox"
      />
    </Paper>
  )
})
