import { observer } from 'mobx-react-lite'
import { styled } from '@mui/material/styles'
import { Box, Checkbox, Paper, Typography } from '@mui/material'

import type { Horse } from '@/domain/horse.domain'
import type { HorseEvent } from '@/domain/horse-event.domain'

import './horse-event-item.css'

import { horseEventsStore, horsesStore } from '@/stores'

// Styled checkbox with green checkmark
const GreenCheckbox = styled(Checkbox)({
  'color': '#ccc',
  '&.Mui-checked': {
    color: '#4CAF50',
  },
})

interface HorseEventItemProps {
  event: HorseEvent
}

export const HorseEventItem = observer(({ event }: HorseEventItemProps) => {
  const { toggleEventCompleted } = horseEventsStore
  const { horses } = horsesStore

  const horse = horses.find(h => h.id === event.horseId) || { name: 'Неизвестная лошадь', id: 0 } as Horse

  const getEventTypeText = (type: string): string => {
    switch (type) {
      case 'collect': return 'Собрать'
      case 'disassemble': return 'Разобрать'
      case 'walk': return 'Выгулить'
      default: return event.name || type
    }
  }

  const handleToggleComplete = () => {
    toggleEventCompleted(event.id)
  }

  // Calculate horse image index (1, 2, or 3) based on horse id
  const horseImageIndex = (Number(horse.id) % 3) + 1

  return (
    <Paper
      className="event-item"
      variant="outlined"
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 1.5,
        borderRadius: 1,
        mb: 1,
      }}
    >
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: 60,
      }}
      >
        <img
          src={`/assets/png2svg/horse${horseImageIndex}.svg`}
          alt={horse.name}
          width={36}
          height={36}
        />
        <Typography
          variant="caption"
          align="center"
          sx={{ mt: 0.5 }}
        >
          {horse.name}
        </Typography>
      </Box>

      <Typography
        variant="body1"
        sx={{
          flex: 1,
          ml: 2,
          fontWeight: 500,
        }}
      >
        {getEventTypeText(event.type)}
      </Typography>

      <GreenCheckbox
        checked={event.completed}
        onChange={handleToggleComplete}
        icon={<Box sx={{ width: 24, height: 24, border: '2px solid #ccc', borderRadius: 1 }} />}
        checkedIcon={(
          <Box sx={{
            width: 24,
            height: 24,
            bgcolor: '#4CAF50',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          >
            <span style={{ color: 'white', fontSize: 18 }}>✓</span>
          </Box>
        )}
      />
    </Paper>
  )
})
