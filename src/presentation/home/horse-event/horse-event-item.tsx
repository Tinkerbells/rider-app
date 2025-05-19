import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import EditIcon from '@mui/icons-material/Edit'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { Box, Checkbox, IconButton, Paper, Typography } from '@mui/material'

import type { Horse } from '@/domain/horse.domain'
import type { HorseEvent } from '@/domain/horse-event.domain'

import './horse-event-item.css'

import { publicUrl } from '@/common/helpers/publicUrl'
import { horseEventsStore, horsesStore } from '@/stores'

import { EditEventDialog } from '../../tasks/edit-event-dialog'

interface HorseEventItemProps {
  event: HorseEvent
}

export const HorseEventItem = observer(({ event }: HorseEventItemProps) => {
  const { toggleEventCompleted } = horseEventsStore
  const { horses } = horsesStore
  const [isEditOpen, setIsEditOpen] = useState(false)

  const horse = horses.find(h => h.id === event.horseId) || { name: 'Лис', id: 1 } as Horse
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

  const handleOpenEdit = () => {
    setIsEditOpen(true)
  }

  const handleCloseEdit = () => {
    setIsEditOpen(false)
  }

  // Get a consistent horse icon based on the horse ID
  const getHorseIcon = () => {
    const index = typeof horse.id === 'number'
      ? (horse.id % 3) + 1
      : Number.parseInt(String(horse.id).substr(-1), 10) % 3 + 1

    return publicUrl(`assets/png2svg/horse${index}.svg`)
  }

  return (
    <>
      <Paper
        elevation={1}
        className="event-item"
        sx={{
          display: 'flex',
          p: 1.5,
          mb: 1,
          alignItems: 'center',
          borderRadius: 2,
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
            src={getHorseIcon()}
            alt={horse.name}
            style={{ width: 40, height: 40 }}
          />
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {horse.name}
          </Typography>
        </Box>

        <Typography variant="body1" sx={{ flex: 1, ml: 2, fontWeight: 500 }}>
          {getEventTypeText(event.type)}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton size="small" onClick={handleOpenEdit} sx={{ mr: 1 }}>
            <EditIcon fontSize="small" />
          </IconButton>

          <Checkbox
            checked={event.completed}
            onChange={handleToggleComplete}
            icon={(
              <Box sx={{
                width: 24,
                height: 24,
                border: '1px solid #ddd',
                borderRadius: 1,
                bgcolor: 'background.paper',
              }}
              />
            )}
            checkedIcon={<CheckCircleIcon sx={{ color: '#4CAF50' }} />}
          />
        </Box>
      </Paper>

      <EditEventDialog
        open={isEditOpen}
        onClose={handleCloseEdit}
        event={event}
      />
    </>
  )
})
