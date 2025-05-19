import type { FC } from 'react'
import type {
  SelectChangeEvent,
} from '@mui/material'

import { ru } from 'date-fns/locale'
import { format, parse } from 'date-fns'
import { Controller, useForm } from 'react-hook-form'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
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

import type { HorseEvent } from '@/domain/horse-event.domain'

import { horseEventsStore, horsesStore, tasksStore } from '@/stores'

interface EditEventDialogProps {
  open: boolean
  onClose: () => void
  event: HorseEvent | null
}

interface EventFormData {
  time: Date | null
  horseId: string | number
  taskIds: string[]
  name?: string
  completed: boolean
}

export const EditEventDialog: FC<EditEventDialogProps> = ({ open, onClose, event }) => {
  const { horses } = horsesStore
  const { tasks } = tasksStore
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
          horseId: event.horse,
          taskIds: event.tasks,
          name: event.name || '',
          completed: event.completed,
        }
      : {
          time: new Date(),
          horseId: '',
          taskIds: [],
          name: '',
          completed: false,
        },
  })

  const watchTaskIds = watch('taskIds')
  // Предполагаем, что у нас есть специальная задача с ID custom, требующая названия
  const hasCustomTask = watchTaskIds && watchTaskIds.includes('custom')

  const onSubmit = (data: EventFormData) => {
    if (!event || !data.time)
      return

    const timeString = format(data.time, 'HH:mm')

    const updatedEvent: Partial<HorseEvent> = {
      horse: data.horseId,
      tasks: data.taskIds,
      name: hasCustomTask ? data.name : undefined,
      time: timeString,
      completed: data.completed,
    }

    updateEvent(event.id, updatedEvent)
    onClose()
  }

  const handleCancel = () => {
    reset()
    onClose()
  }

  const handleTasksChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[]
    setValue('taskIds', value)

    // Если убрали Custom из списка, очищаем имя
    if (!value.includes('custom')) {
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
                    {horses.map(horse => (
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
              name="taskIds"
              control={control}
              rules={{
                required: 'Выберите хотя бы одну задачу',
                validate: value => (value && value.length > 0) || 'Выберите хотя бы одну задачу',
              }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.taskIds}>
                  <InputLabel>Задачи</InputLabel>
                  <Select
                    {...field}
                    multiple
                    value={field.value}
                    onChange={handleTasksChange}
                    input={<OutlinedInput label="Задачи" />}
                    renderValue={selected => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((taskId) => {
                          const task = tasks.find(t => t.id === taskId)
                          return (
                            <Chip
                              key={taskId}
                              label={task ? task.title : taskId}
                              sx={{
                                backgroundColor: task?.color,
                                color: task?.color ? '#fff' : undefined,
                              }}
                            />
                          )
                        })}
                      </Box>
                    )}
                  >
                    {tasks.map(task => (
                      <MenuItem key={task.id} value={task.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box
                            sx={{
                              width: 16,
                              height: 16,
                              borderRadius: '50%',
                              backgroundColor: task.color || 'transparent',
                              mr: 1,
                              border: theme => `1px solid ${theme.palette.divider}`,
                            }}
                          />
                          {task.title}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.taskIds && (
                    <FormHelperText>{errors.taskIds.message}</FormHelperText>
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
