import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import EditIcon from '@mui/icons-material/Edit'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { Box, Checkbox, Chip, IconButton, Paper, Typography } from '@mui/material'

import type { HorseEvent } from '@/domain/horse-event.domain'

import { horseEventsStore } from '@/stores'
import { HorseEventTasks } from '@/domain/horse-event.domain'

import './horse-event-item.css'
import horseIcon from '../../../../assets/horse.png'
import { EditEventDialog } from '../../tasks/edit-event-dialog'

interface HorseEventItemProps {
  event: HorseEvent
}

export const HorseEventItem = observer(({ event }: HorseEventItemProps) => {
  const { toggleEventCompleted } = horseEventsStore
  const [isEditOpen, setIsEditOpen] = useState(false)

  const getTaskText = (task: HorseEventTasks): string => {
    switch (task) {
      case HorseEventTasks.COLLECT: return 'Собрать'
      case HorseEventTasks.DISASSEMBLE: return 'Разобрать'
      case HorseEventTasks.WALK: return 'Выгулить'
      case HorseEventTasks.CUSTOM: return event.name || 'Другое'
      default: return task
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
            src={horseIcon}
            alt={event.horse.name}
            style={{ width: 40, height: 40 }}
          />
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {event.horse.name}
          </Typography>
        </Box>

        <Box sx={{ flex: 1, ml: 2 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {event.tasks.map((task, index) => (
              <Chip
                key={index}
                label={getTaskText(task)}
                size="small"
              />
            ))}
          </Box>
        </Box>

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
