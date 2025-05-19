import type { FC } from 'react'

import { useState } from 'react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { observer } from 'mobx-react-lite'
import EditIcon from '@mui/icons-material/Edit'
import ClearIcon from '@mui/icons-material/Clear'
import SearchIcon from '@mui/icons-material/Search'
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material'

import type { Horse } from '@/domain/horse.domain'
import type { HorseEvent } from '@/domain/horse-event.domain'

import { horseEventsStore, horsesStore } from '@/stores'

import { Page } from '../core/page'
import { EditEventDialog } from './edit-event-dialog'

export const TasksPage: FC = observer(() => {
  const { events } = horseEventsStore
  const { horses } = horsesStore
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<'all' | 'completed' | 'active'>('all')
  const [editingEvent, setEditingEvent] = useState<HorseEvent | null>(null)

  const getHorseName = (horseId: Horse['id']) => {
    const horse = horses.find(h => h.id === horseId)
    return horse ? horse.name : 'Неизвестная лошадь'
  }

  const getEventTypeText = (type: string): string => {
    switch (type) {
      case 'collect': return 'Собрать'
      case 'disassemble': return 'Разобрать'
      case 'walk': return 'Выгулить'
      default: return type
    }
  }

  const formatEventDate = (date: string) => {
    return format(new Date(date), 'd MMMM', { locale: ru })
  }

  const handleEdit = (event: HorseEvent) => {
    setEditingEvent(event)
  }

  const handleCloseEdit = () => {
    setEditingEvent(null)
  }

  // Filter and sort events
  const filteredEvents = events
    .filter((event) => {
      // Apply completion filter
      if (filter === 'completed')
        return event.completed
      if (filter === 'active')
        return !event.completed

      // Always true for 'all' filter
      return true
    })
    .filter((event) => {
      // Apply search filter
      if (!searchTerm)
        return true

      const horseName = getHorseName(event.horseId).toLowerCase()
      const eventType = getEventTypeText(event.type).toLowerCase()
      const searchLower = searchTerm.toLowerCase()

      return horseName.includes(searchLower) || eventType.includes(searchLower)
    })
    // Sort by date (newest first) and then by time
    .sort((a, b) => {
      // Sort by date first
      const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime()
      if (dateCompare !== 0)
        return dateCompare

      // If same date, sort by time
      return a.time.localeCompare(b.time)
    })

  return (
    <Page>
      <Container maxWidth="sm" sx={{ py: 2, height: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h5" component="h1" sx={{ mb: 2 }}>
          Задачи
        </Typography>

        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Поиск по лошади или действию"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton onClick={() => setSearchTerm('')} edge="end">
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            variant="outlined"
            size="small"
            sx={{ mb: 1 }}
          />

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant={filter === 'all' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setFilter('all')}
            >
              Все
            </Button>
            <Button
              variant={filter === 'active' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setFilter('active')}
            >
              Активные
            </Button>
            <Button
              variant={filter === 'completed' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setFilter('completed')}
            >
              Выполненные
            </Button>
          </Box>
        </Box>

        <List sx={{ flex: 1, overflow: 'auto' }}>
          {filteredEvents.length > 0
            ? (
                filteredEvents.map((event, index) => (
                  <Box key={event.id}>
                    {index > 0 && <Divider />}
                    <ListItem
                      secondaryAction={(
                        <IconButton edge="end" onClick={() => handleEdit(event)}>
                          <EditIcon />
                        </IconButton>
                      )}
                    >
                      <ListItemText
                        primary={(
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 4 }}>
                            <Typography variant="body1">
                              {getHorseName(event.horseId)}
                              {' '}
                              -
                              {getEventTypeText(event.type)}
                            </Typography>
                            <Chip
                              label={event.completed ? 'Выполнено' : 'Активно'}
                              color={event.completed ? 'success' : 'primary'}
                              size="small"
                            />
                          </Box>
                        )}
                        secondary={(
                          <Typography variant="body2" color="text.secondary">
                            {formatEventDate(event.date)}
                            {' '}
                            в
                            {event.time}
                          </Typography>
                        )}
                      />
                    </ListItem>
                  </Box>
                ))
              )
            : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Typography variant="body1" color="text.secondary">
                    Нет задач, соответствующих критериям
                  </Typography>
                </Box>
              )}
        </List>
      </Container>

      <EditEventDialog
        open={!!editingEvent}
        onClose={handleCloseEdit}
        event={editingEvent}
      />
    </Page>
  )
})
