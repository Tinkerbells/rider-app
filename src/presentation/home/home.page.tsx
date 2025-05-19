import type { FC } from 'react'

import { useState } from 'react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { observer } from 'mobx-react-lite'
import AddIcon from '@mui/icons-material/Add'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import { Box, Container, Fab, IconButton, Paper, Typography } from '@mui/material'

import { horseEventsStore } from '@/stores'

import { Page } from '../core/page'
import { AddEventDialog, HorseEventItem } from './horse-event'

export const HomePage: FC = observer(() => {
  const { eventsByTime, selectedDate } = horseEventsStore
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // Format the date for display (e.g., "Смена 19.05")
  const formattedDate = format(new Date(selectedDate), '\'Смена\' dd.MM', { locale: ru })

  const handleOpenAddDialog = () => {
    setIsAddDialogOpen(true)
  }

  const handleCloseAddDialog = () => {
    setIsAddDialogOpen(false)
  }

  return (
    <Page back={false}>
      <Container maxWidth="sm" sx={{ py: 2, height: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column' }}>
        <Paper elevation={0} sx={{ p: 2, mb: 2, borderRadius: 4 }}>
          <Typography variant="h5" component="h1" fontWeight="bold" align="center" sx={{ mb: 1 }}>
            {formattedDate}
          </Typography>

          {/* <DateSelector */}
          {/*   currentDate={selectedDate} */}
          {/*   onPrevDay={handlePrevDay} */}
          {/*   onNextDay={handleNextDay} */}
          {/*   onSelectDate={setSelectedDate} */}
          {/* /> */}
        </Paper>

        <Box sx={{ flex: 1, overflow: 'auto', mb: 2, px: 1 }}>
          {eventsByTime.length > 0
            ? (
                eventsByTime.map(({ time, events }) => (
                  <Box key={time} sx={{ mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                      {time}
                    </Typography>
                    {events.map(event => (
                      <HorseEventItem key={event.id} event={event} />
                    ))}
                  </Box>
                ))
              )
            : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Typography variant="body1" color="text.secondary">
                    Нет событий на этот день
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

        <AddEventDialog open={isAddDialogOpen} onClose={handleCloseAddDialog} />
      </Container>
    </Page>
  )
})
