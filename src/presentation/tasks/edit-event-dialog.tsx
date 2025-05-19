import type { FC } from 'react'

import { ru } from 'date-fns/locale'
import { format, parse } from 'date-fns'
import { Controller, useForm } from 'react-hook-form'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'

import type { HorseEvent } from '@/domain/horse-event.domain'

import { horseEventsStore, horsesStore } from '@/stores'
import { HorseEventType } from '@/domain/horse-event.domain'

interface EditEventDialogProps {
  open: boolean
  onClose: () => void
  event: HorseEvent | null
}

interface EventFormData {
  time: Date | null
  date: Date | null
  horseId: string | number
  eventType: HorseEventType
  name?: string
  completed: boolean
}

export const EditEventDialog: FC<EditEventDialogProps> = ({ open, onClose, event }) => {
  const { horses } = horsesStore
  const { updateEvent } = horseEventsStore

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<EventFormData>({
    defaultValues: event
      ? {
          time: event.time ? parse(event.time, 'HH:mm', new Date()) : new Date(),
          date: event.date ? new Date(event.date) : new Date(),
          horseId: event.horseId,
          eventType: event.type as HorseEventType,
          name: event.name || '',
          completed: event.completed,
        }
      : {
          time: new Date(),
          date: new Date(),
          horseId: '',
          eventType: HorseEventType.COLLECT,
          name: '',
          completed: false,
        },
  })

  // Watch the event type to conditionally render the name field
  const watchEventType = watch('eventType')

  const onSubmit = (data: EventFormData) => {
    if (!event || !data.time || !data.date)
      return

    const timeString = format(data.time, 'HH:mm')
    const dateString = format(data.date, 'yyyy-MM-dd')

    const updatedEvent: Partial<HorseEvent> = {
      horseId: data.horseId,
      type: data.eventType,
      name: data.eventType === HorseEventType.CUSTOM ? data.name : undefined,
      time: timeString,
      date: dateString,
      completed: data.completed,
    }

    updateEvent(event.id, updatedEvent)
    onClose()
  }

  const handleCancel = () => {
    reset()
    onClose()
  }

  if (!event)
    return null

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
      <DialogTitle>Редактировать задачу</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
              <Controller
                name="date"
                control={control}
                rules={{ required: 'Дата обязательна' }}
                render={({ field }) => (
                  <DatePicker
                    label="Дата"
                    value={field.value}
                    onChange={field.onChange}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.date,
                        helperText: errors.date?.message,
                      },
                    }}
                  />
                )}
              />

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
                    {horses
                      && horses.map(horse => (
                        <MenuItem key={horse.id} value={horse.id}>
                          {horse.name}
                        </MenuItem>
                      ))}
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

            <Controller
              name="completed"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={(
                    <Checkbox
                      checked={field.value}
                      onChange={e => field.onChange(e.target.checked)}
                    />
                  )}
                  label="Выполнено"
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="inherit">
            Отмена
          </Button>
          <Button type="submit" color="primary" variant="contained">
            Сохранить
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
