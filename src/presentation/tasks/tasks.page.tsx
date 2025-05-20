import type { FC } from 'react'

import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import { MuiColorInput } from 'mui-color-input'
import DeleteIcon from '@mui/icons-material/Delete'
import { Controller, useForm } from 'react-hook-form'
import {
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  FormControl,
  List,
  ListItem,
  Paper,
  TextField,
  Typography,
} from '@mui/material'

import type { Task } from '@/domain/task.domain'

import { TasksController } from '@/controllers'

import { Page } from '../core/page'

interface TaskFormData {
  title: string
  color: string
}

interface TaskFormDialogProps {
  open: boolean
  onClose: () => void
  task?: Task
  isEdit?: boolean
  onDelete?: (id: string) => void
}

const TaskFormDialog: FC<TaskFormDialogProps> = ({ open, onClose, task, isEdit = false, onDelete }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    defaultValues: {
      title: task?.title || '',
      color: task?.color || '#1976d2',
    },
  })

  useEffect(() => {
    if (task && isEdit) {
      reset({ title: task.title, color: task.color })
    }
  }, [task, isEdit, reset])

  const onSubmit = (data: TaskFormData) => {
    if (isEdit && task) {
      TasksController.updateTask(task.id, { ...task, ...data })
    }
    else {
      TasksController.addTask({
        id: Date.now().toString(),
        title: data.title,
        color: data.color,
      })
    }

    reset({ title: '', color: '#1976d2' })
    onClose()
  }

  const handleCancel = () => {
    reset({ title: '', color: '#1976d2' })
    onClose()
  }

  const handleDelete = () => {
    if (task && onDelete) {
      onDelete(task.id)
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="xs">
      <DialogTitle>{isEdit ? 'Редактировать задачу' : 'Добавить задачу'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Controller
              name="title"
              control={control}
              rules={{
                required: 'Название задачи обязательно',
                minLength: {
                  value: 2,
                  message: 'Название должно содержать минимум 2 символа',
                },
              }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.title}>
                  <TextField
                    {...field}
                    autoFocus
                    margin="dense"
                    label="Название задачи"
                    fullWidth
                    error={!!errors.title}
                    helperText={errors.title?.message}
                  />
                </FormControl>
              )}
            />

            <Controller
              name="color"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <MuiColorInput
                    {...field}
                    label="Цвет задачи"
                    format="hex"
                    fullWidth
                  />
                </FormControl>
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          {isEdit && (
            <Button
              onClick={handleDelete}
              color="error"
              variant="contained"
              startIcon={<DeleteIcon />}
            >
              Удалить
            </Button>
          )}
          <Button type="submit" color="primary" variant="contained">
            {isEdit ? 'Сохранить' : 'Добавить'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export const TasksPage: FC = observer(() => {
  const { tasks, removeTask } = TasksController
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined)

  const handleAddTask = () => {
    setEditingTask(undefined)
    setDialogOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setDialogOpen(true)
  }

  const handleDeleteTask = (id: Task['id']) => {
    removeTask(id)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
  }

  return (
    <Page>
      <Container maxWidth="sm" sx={{ py: 2, height: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column' }}>
        <Paper elevation={0} sx={{ p: 2, mb: 2, borderRadius: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h5" component="h1" fontWeight="bold" align="center">
              Задачи
            </Typography>
          </Box>
        </Paper>

        <Box sx={{ flex: 1, overflow: 'auto', mb: 2, px: 1 }}>
          <List sx={{ flex: 1, overflow: 'auto' }}>
            {tasks.length > 0
              ? (
                  tasks.map(task => (
                    <Paper
                      key={task.id}
                      elevation={2}
                      sx={{
                        'm': 1,
                        'borderRadius': 2,
                        'transition': 'all 0.2s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 4,
                        },
                        'overflow': 'hidden',
                      }}
                    >
                      <ListItem
                        onClick={() => handleEditTask(task)}
                        sx={{
                          cursor: 'pointer',
                          p: 0,
                        }}
                      >
                        <Box sx={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          p: 2,
                        }}
                        >
                          <Chip
                            label={task.title}
                            sx={{
                              backgroundColor: task.color,
                              color: task.color ? '#fff' : undefined,
                            }}
                          />
                          <EditIcon color="action" fontSize="small" />
                        </Box>
                      </ListItem>
                    </Paper>
                  ))
                )
              : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography variant="body1" color="text.secondary">
                      Нет добавленных задач
                    </Typography>
                  </Box>
                )}
          </List>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Fab
            color="primary"
            aria-label="add"
            onClick={handleAddTask}
            sx={{ position: 'relative', zIndex: 1 }}
          >
            <AddIcon />
          </Fab>
        </Box>
      </Container>
      <TaskFormDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        task={editingTask}
        isEdit={!!editingTask}
        onDelete={handleDeleteTask}
      />
    </Page>
  )
})
