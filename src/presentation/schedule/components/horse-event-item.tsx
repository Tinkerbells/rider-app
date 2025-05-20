import { useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import EditIcon from '@mui/icons-material/Edit'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { Avatar, Box, Checkbox, Chip, IconButton, Paper, Typography } from '@mui/material'

import type { NullableType } from '@/common'
import type { Task } from '@/domain/task.domain'

import './horse-event-item.css'

import type { Horse } from '@/domain/horse.domain'
import type { HorseEvent } from '@/domain/horse-event.domain'

import horseIcon from '../../../../assets/horse.png'

interface HorseEventItemProps {
  event: HorseEvent
  toggleEvent: (id: HorseEvent['id']) => void
  allTasks: Task[]
  horse: NullableType<Horse>
  handleOpenEdit: () => void
}

export const HorseEventItem = observer(({ event, allTasks, horse, toggleEvent, handleOpenEdit }: HorseEventItemProps) => {
  const tasks = useMemo(() => (
    allTasks.filter(t => event.tasksIds.includes(t.id))
  ), [allTasks, event])

  const handleToggleComplete = () => {
    toggleEvent(event.id)
  }

  if (!horse)
    return null // Если лошадь не найдена, не отображаем событие

  return (
    <>
      <Paper
        elevation={1}
        className="event-item"
        sx={{
          'display': 'flex',
          'p': 1.5,
          'mb': 1,
          'alignItems': 'center',
          'borderRadius': 2,
          'transition': 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 4,
          },
          'overflow': 'hidden',
        }}
      >
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: 60,
        }}
        >
          <Avatar src={horseIcon} alt={horse.name} sx={{ width: 40, height: 40 }} />
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {horse.name}
          </Typography>
        </Box>

        <Box sx={{ flex: 1, ml: 2 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {tasks.map(task => (
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
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton size="small" onClick={handleOpenEdit} sx={{ mr: 1 }}>
            <EditIcon fontSize="small" />
          </IconButton>

          <Checkbox
            checked={event.completed}
            onChange={handleToggleComplete}
            checkedIcon={<CheckCircleIcon sx={{ color: '#4CAF50', fontSize: 30 }} />}
            sx={{ '& .MuiSvgIcon-root': { fontSize: 30 } }}
          />
        </Box>
      </Paper>
    </>
  )
})
