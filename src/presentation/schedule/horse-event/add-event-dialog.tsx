import type { FC } from 'react'
import type {
  SelectChangeEvent,
} from '@mui/material'

import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Controller, useForm } from 'react-hook-form'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from '@mui/material'

import type { HorseEvent } from '@/domain/horse-event.domain'

import { horseEventsStore, horsesStore } from '@/stores'
import { HorseEventTasks } from '@/domain/horse-event.domain'

interface AddEventDialogProps {
  open: boolean
  onClose: () => void
}

interface EventFormData {
  time: Date | null
  horseId: string | number
  tasks: HorseEventTasks[] // Изменено с eventType на tasks (массив)
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
    setValue,
    formState: { errors },
  } = useForm<EventFormData>({
    defaultValues: {
      time: new Date(),
      horseId: '',
      tasks: [HorseEventTasks.COLLECT], // По умолчанию одна задача
      name: '',
    },
  })

  const watchTasks = watch('tasks')
  const hasCustomTask = watchTasks.includes(HorseEventTasks.CUSTOM)

  const onSubmit = (data: EventFormData) => {
    const horse = horses.find(h => h.id === data.horseId)
    if (!data.time)
      return

    if (data.tasks.length === 0) {
      // Должна быть хотя бы одна задача
      return
    }
    if (horse) {
      const newEvent: HorseEvent = {
        id: Date.now().toString(),
        horse,
        tasks: data.tasks,
        name: hasCustomTask ? data.name : undefined,
        time: format(data.time, 'HH:mm'),
        date: selectedDate,
        completed: false,
      }

      addEvent(newEvent)
      reset()
      onClose()
    }
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
