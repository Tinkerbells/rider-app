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

import { horseEventsStore, horsesStore, tasksStore } from '@/stores'

interface AddEventDialogProps {
  open: boolean
  onClose: () => void
}

interface EventFormData {
  time: Date | null
  horseId: string | number
  taskIds: string[]
  name?: string
}

export const AddEventDialog: FC<AddEventDialogProps> = ({ open, onClose }) => {
  const { horses } = horsesStore
  const { tasks } = tasksStore
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
      taskIds: [],
      name: '',
    },
  })

  const watchTaskIds = watch('taskIds')
  // Предполагаем, что у нас есть специальная задача с ID custom, требующая названия
  const hasCustomTask = watchTaskIds.includes('custom')

  const onSubmit = (data: EventFormData) => {
    if (!data.time || !data.horseId)
      return

    if (data.taskIds.length === 0) {
      // Должна быть хотя бы одна задача
      return
    }

    const newEvent: HorseEvent = {
      id: Date.now().toString(),
      horse: data.horseId,
      tasks: data.taskIds,
      name: hasCustomTask ? data.name : undefined,
      time: format(data.time, 'HH:mm'),
      date: selectedDate,
      completed: false,
    }

    addEvent(newEvent)
    reset()
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
                validate: value => value.length > 0 || 'Выберите хотя бы одну задачу',
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
