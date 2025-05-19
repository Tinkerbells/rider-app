import type { FC } from 'react'

import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Controller, useForm } from 'react-hook-form'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'

import type { HorseEvent } from '@/domain/horse-event.domain'

import { horseEventsStore, horsesStore } from '@/stores'
import { HorseEventType } from '@/domain/horse-event.domain'

interface AddEventDialogProps {
  open: boolean
  onClose: () => void
}

interface EventFormData {
  time: Date | null
  horseId: string | number
  eventType: HorseEventType
  name?: string
}

export const AddEventDialog: FC<AddEventDialogProps> = ({ open, onClose }) => {
  const { horses } = horsesStore
  const { selectedDate, addEvent } = horseEventsStore

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<EventFormData>({
    defaultValues: {
      time: new Date(),
      horseId: '',
      eventType: HorseEventType.COLLECT,
      name: '',
    },
  })

  const watchEventType = watch('eventType')

  const onSubmit = async (data: EventFormData) => {
    if (!data.time)
      return

    const timeString = format(data.time, 'HH:mm')
    const newEvent: HorseEvent = {
      id: Date.now().toString(),
      horseId: data.horseId,
      type: data.eventType,
      name: data.name && data.eventType === HorseEventType.CUSTOM ? data.name : undefined,
      time: timeString,
      date: selectedDate,
      completed: false,
    }

    await addEvent(newEvent)
    reset()
    onClose()
  }

  const handleCancel = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
      <DialogTitle>Добавить запись</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
              <Controller
                name="time"
                control={control}
                rules={{ required: 'Время обязательно' }}
                render={({ field }) => (
                  <TimePicker
                    label="Время"
                    value={field.value}
                    onChange={field.onChange}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.time,
                        helperText: errors.time?.message,
                      },
                    }}
                  />
                )}
              />
            </LocalizationProvider>

            <Controller
              name="horseId"
              control={control}
              rules={{ required: 'Выберите лошадь' }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.horseId}>
                  <InputLabel>Лошадь</InputLabel>
                  <Select
                    {...field}
                    label="Лошадь"
                  >
                    {horses.length > 0
                      ? (
                          horses.map(horse => (
                            <MenuItem key={horse.id} value={horse.id}>
                              {horse.name}
                            </MenuItem>
                          ))
                        )
                      : (
                          <MenuItem value={1}>Лис</MenuItem>
                        )}
                  </Select>
                  {errors.horseId && (
                    <FormHelperText>{errors.horseId.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />

            <Controller
              name="eventType"
              control={control}
              rules={{ required: 'Выберите тип действия' }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.eventType}>
                  <InputLabel>Тип действия</InputLabel>
                  <Select
                    {...field}
                    label="Тип действия"
                  >
                    <MenuItem value={HorseEventType.COLLECT}>Собрать</MenuItem>
                    <MenuItem value={HorseEventType.DISASSEMBLE}>Разобрать</MenuItem>
                    <MenuItem value={HorseEventType.WALK}>Выгулить</MenuItem>
                    <MenuItem value={HorseEventType.CUSTOM}>Другое</MenuItem>
                  </Select>
                  {errors.eventType && (
                    <FormHelperText>{errors.eventType.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />

            {watchEventType === HorseEventType.CUSTOM && (
              <Controller
                name="name"
                control={control}
                rules={{
                  required: watchEventType === HorseEventType.CUSTOM ? 'Введите название' : false,
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Название"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="inherit">
            Отмена
          </Button>
          <Button type="submit" color="primary" variant="contained">
            Добавить
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
