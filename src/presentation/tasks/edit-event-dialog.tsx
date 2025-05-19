import type { FC } from 'react'
import type {
  SelectChangeEvent,
} from '@mui/material'

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
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from '@mui/material'

import type { Horse } from '@/domain/horse.domain'
import type { HorseEvent } from '@/domain/horse-event.domain'

import { horseEventsStore, horsesStore } from '@/stores'
import { HorseEventTasks } from '@/domain/horse-event.domain'

interface EditEventDialogProps {
  open: boolean
  onClose: () => void
  event: HorseEvent | null
}

interface EventFormData {
  time: Date | null
  date: Date | null
  horse: Horse
  tasks: HorseEventTasks[] // Теперь массив задач
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
    setValue,
    formState: { errors },
  } = useForm<EventFormData>({
    defaultValues: event
      ? {
          time: event.time ? parse(event.time, 'HH:mm', new Date()) : new Date(),
          date: event.date ? new Date(event.date) : new Date(),
          horse: event.horse,
          tasks: event.tasks,
          name: event.name || '',
          completed: event.completed,
        }
      : {
          time: new Date(),
          date: new Date(),
          horse: horses[0],
          tasks: [HorseEventTasks.COLLECT],
          name: '',
          completed: false,
        },
  })

  const watchTasks = watch('tasks')
  const hasCustomTask = watchTasks && watchTasks.includes(HorseEventTasks.CUSTOM)

  const onSubmit = (data: EventFormData) => {
    if (!event || !data.time || !data.date)
      return

    const timeString = format(data.time, 'HH:mm')
    const dateString = format(data.date, 'yyyy-MM-dd')

    const updatedEvent: Partial<HorseEvent> = {
      horse: data.horse,
      tasks: data.tasks,
      name: hasCustomTask ? data.name : undefined,
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

  const handleTasksChange = (event: SelectChangeEvent<HorseEventTasks[]>) => {
    const value = event.target.value as HorseEventTasks[]
    setValue('tasks', value)

    // Если убрали Custom из списка, очищаем имя
    if (!value.includes(HorseEventTasks.CUSTOM)) {
      setValue('name', '')
    }
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
              name="horse"
              control={control}
              rules={{ required: 'Выберите лошадь' }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.horse}>
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
                  {errors.horse && (
                    <FormHelperText>{errors.horse.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />

            <Controller
              name="tasks"
              control={control}
              rules={{
                required: 'Выберите хотя бы одну задачу',
                validate: value => value.length > 0 || 'Выберите хотя бы одну задачу',
              }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.tasks}>
                  <InputLabel>Задачи</InputLabel>
                  <Select
                    {...field}
                    multiple
                    value={field.value}
                    onChange={handleTasksChange}
                    input={<OutlinedInput label="Задачи" />}
                    renderValue={selected => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map(value => (
                          <Chip
                            key={value}
                            label={
                              value === HorseEventTasks.COLLECT
                                ? 'Собрать'
                                : value === HorseEventTasks.DISASSEMBLE
                                  ? 'Разобрать'
                                  : value === HorseEventTasks.WALK
                                    ? 'Выгулить'
                                    : value === HorseEventTasks.CUSTOM ? 'Другое' : value
                            }
                          />
                        ))}
                      </Box>
                    )}
                  >
                    <MenuItem value={HorseEventTasks.COLLECT}>Собрать</MenuItem>
                    <MenuItem value={HorseEventTasks.DISASSEMBLE}>Разобрать</MenuItem>
                    <MenuItem value={HorseEventTasks.WALK}>Выгулить</MenuItem>
                    <MenuItem value={HorseEventTasks.CUSTOM}>Другое</MenuItem>
                  </Select>
                  {errors.tasks && (
                    <FormHelperText>{errors.tasks.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />

            {hasCustomTask && (
              <Controller
                name="name"
                control={control}
                rules={{
                  required: hasCustomTask ? 'Введите название пользовательской задачи' : false,
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Название пользовательской задачи"
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
