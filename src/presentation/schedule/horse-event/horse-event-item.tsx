import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import EditIcon from '@mui/icons-material/Edit'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { Box, Checkbox, Chip, IconButton, Paper, Typography } from '@mui/material'

import type { HorseEvent } from '@/domain/horse-event.domain'

import { horseEventsStore, horsesStore, tasksStore } from '@/stores'

import './horse-event-item.css'
import horseIcon from '../../../../assets/horse.png'
import { EditEventDialog } from '../../tasks/edit-event-dialog'

interface HorseEventItemProps {
  event: HorseEvent
}

export const HorseEventItem = observer(({ event }: HorseEventItemProps) => {
  const { toggleEventCompleted } = horseEventsStore
  const { horses } = horsesStore
  const { tasks } = tasksStore
  const [isEditOpen, setIsEditOpen] = useState(false)

  // Находим объект лошади по ID
  const horse = horses.find(h => h.id === event.horse)
  // Находим объекты задач по их ID
  const eventTasks = tasks.filter(task => event.tasks.includes(task.id))

  const handleToggleComplete = () => {
    toggleEventCompleted(event.id)
  }

  const handleOpenEdit = () => {
    setIsEditOpen(true)
  }

  const handleCloseEdit = () => {
    setIsEditOpen(false)
  }

  if (!horse)
    return null // Если лошадь не найдена, не отображаем событие

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
            alt={horse.name}
            style={{ width: 40, height: 40 }}
          />
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {horse.name}
          </Typography>
        </Box>

        <Box sx={{ flex: 1, ml: 2 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {eventTasks.map(task => (
              <Chip
                key={task.id}
                label={task.title}
                size="small"
                sx={{
                  backgroundColor: task.color,
                  color: task.color ? '#fff' : undefined,
                }}
              />
            ))}
            {event.name && (
              <Chip
                label={event.name}
                size="small"
                variant="outlined"
              />
            )}
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
