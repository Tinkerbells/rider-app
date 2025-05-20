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
} from '@mui/material'

import type { Task } from '@/domain/task.domain'
import type { Horse } from '@/domain/horse.domain'
import type { HorseEvent } from '@/domain/horse-event.domain'

import { HorseAutocomplete } from './horse-autocomplete'

interface AddEventDialogProps {
  open: boolean
  onClose: () => void
  horses: Horse[]
  tasks: Task[]
  addEvent: (event: HorseEvent) => void
  loading: boolean
}

interface AddEventForm extends Omit<HorseEvent, 'date' | 'time'> {
  time: Date
  date: Date
}

export const AddEventDialog: FC<AddEventDialogProps> = ({ open, onClose, tasks, horses, addEvent, loading }) => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AddEventForm>({
    defaultValues: {
      time: new Date(),
      date: new Date(),
      tasksIds: [],
      horseId: '',
      completed: false,
    },
  })

  const onSubmit = (data: AddEventForm) => {
    if (!data.time || !data.horseId)
      return

    if (data.tasksIds.length === 0) {
      // Должна быть хотя бы одна задача
      return
    }

    const newEvent: HorseEvent = {
      id: Date.now().toString(),
      horseId: data.horseId,
      tasksIds: data.tasksIds,
      time: format(data.time, 'HH:mm'),
      date: format(new Date(), 'MM-dd-yyyy'),
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
    setValue('tasksIds', value)
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
                <HorseAutocomplete
                  loading={loading}
                  horses={horses}
                  value={field.value}
                  onChange={field.onChange}
                  error={!!errors.horseId}
                  helperText={errors.horseId?.message}
                  required
                />
              )}
            />

            <Controller
              name="tasksIds"
              control={control}
              rules={{
                required: 'Выберите хотя бы одну задачу',
                validate: value => value.length > 0 || 'Выберите хотя бы одну задачу',
              }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.tasksIds}>
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
                  {errors.tasksIds && (
                    <FormHelperText>{errors.tasksIds.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
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
