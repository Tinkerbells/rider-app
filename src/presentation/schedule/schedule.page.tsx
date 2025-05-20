import type { FC } from 'react'

import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Fragment, useState } from 'react'
import { observer } from 'mobx-react-lite'
import AddIcon from '@mui/icons-material/Add'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import {
  Box,
  Container,
  Fab,
  FormControlLabel,
  IconButton,
  Paper,
  Switch,
  Typography,
} from '@mui/material'

import type { HorseEvent } from '@/domain/horse-event.domain'

import { HorseEventsContoller, HorsesController, TasksController } from '@/controllers'

import { Page } from '../core/page'
import { NotFoundIcon } from '../ui'
import { AddEventDialog, HorseEventItem } from './components'
import { EditEventDialog } from './components/edit-event-dialog'

export const SchedulePage: FC = observer(() => {
  const {
    eventsByTime,
    selectedDate,
    showCompleted,
    toggleShowCompleted,
    toggleEventCompleted,
    addEvent,
    updateEvent,
    loading,
  } = HorseEventsContoller

  const { findOneById, horses } = HorsesController
  const { tasks } = TasksController

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  // Изменяем подход к отслеживанию редактируемого события
  const [editingEvent, setEditingEvent] = useState<HorseEvent | null>(null)

  const formattedDate = format(new Date(selectedDate), '\'Смена\' dd.MM', { locale: ru })

  const handleOpenAddDialog = () => {
    setIsAddDialogOpen(true)
  }

  const handleCloseAddDialog = () => {
    setIsAddDialogOpen(false)
  }

  // Изменяем функцию открытия диалога редактирования, чтобы принимать конкретное событие
  const handleOpenEditDialog = (event: HorseEvent) => {
    setEditingEvent(event)
  }

  const handleCloseEditDialog = () => {
    setEditingEvent(null)
  }

  return (
    <Page back={false}>
      <Container maxWidth="sm" sx={{ py: 2, height: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column' }}>
        <Paper elevation={0} sx={{ p: 2, mb: 2, borderRadius: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h5" component="h1" fontWeight="bold" align="center">
              {formattedDate}
            </Typography>
          </Box>
        </Paper>
        <Box sx={{ display: 'flex', justifyContent: 'end', mb: 2 }}>
          <FormControlLabel
            sx={{ flexDirection: 'row-reverse' }}
            control={(
              <Switch
                checked={showCompleted}
                onChange={toggleShowCompleted}
                color="primary"
              />
            )}
            label="Выполненные"
          />
        </Box>
        <Box sx={{ flex: 1, overflow: 'auto', mb: 2, px: 1 }}>
          {eventsByTime.length > 0
            ? (
                eventsByTime.map(({ time, events }) => (
                  <Box key={time} sx={{ mb: 3 }}>
                    <Typography color="text.primary" variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                      {time}
                    </Typography>
                    {events.map(event => (
                      <Fragment key={event.id}>
                        <HorseEventItem
                          // Передаем событие при открытии диалога редактирования
                          handleOpenEdit={() => handleOpenEditDialog(event)}
                          allTasks={tasks}
                          horse={findOneById(event.horseId)}
                          toggleEvent={toggleEventCompleted}
                          event={event}
                        />
                      </Fragment>
                    ))}
                  </Box>
                ))
              )
            : (
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Box sx={{ ml: 8 }}>
                    <NotFoundIcon width="160px" height="160px" />
                  </Box>
                  <Typography variant="subtitle1" color="text.primary" align="center">
                    Добавьте события или включите выполненные
                  </Typography>
                </Box>
              )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Fab
            color="primary"
            aria-label="add"
            onClick={handleOpenAddDialog}
            sx={{ position: 'relative', zIndex: 1 }}
          >
            <AddIcon />
          </Fab>

          <IconButton
            sx={{
              position: 'absolute',
              right: 16,
              bottom: 72,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              width: 48,
              height: 48,
            }}
          >
            <NoteAddIcon />
          </IconButton>
        </Box>

        {/* Диалоги теперь находятся вне цикла рендеринга событий */}
        <AddEventDialog
          loading={loading}
          open={isAddDialogOpen}
          onClose={handleCloseAddDialog}
          horses={horses}
          tasks={tasks}
          addEvent={addEvent}
        />

        {/* Рендерим диалог редактирования только когда есть выбранное событие */}
        {editingEvent && (
          <EditEventDialog
            loading={loading}
            horses={horses}
            tasks={tasks}
            open={!!editingEvent}
            onClose={handleCloseEditDialog}
            event={editingEvent}
            updateEvent={updateEvent}
          />
        )}
      </Container>
    </Page>
  )
})
