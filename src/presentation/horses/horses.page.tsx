import type { FC } from 'react'

import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { Controller, useForm } from 'react-hook-form'
import {
  Avatar,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material'

import type { Horse } from '@/domain/horse.domain'

import { HorsesController } from '@/controllers'
import { publicUrl } from '@/common/helpers/publicUrl'

import { Page } from '../core/page'

interface HorseFormData {
  name: string
}

interface HorseFormDialogProps {
  open: boolean
  onClose: () => void
  horse?: Horse
  isEdit?: boolean
}

const HorseFormDialog: FC<HorseFormDialogProps> = ({ open, onClose, horse, isEdit = false }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HorseFormData>({
    defaultValues: {
      name: horse?.name || '',
    },
  })

  const onSubmit = (data: HorseFormData) => {
    if (isEdit && horse) {
      HorsesController.updateHorse(horse.id, { ...horse, name: data.name })
    }
    else {
      HorsesController.addHorse({
        id: Date.now().toString(),
        name: data.name,
        colors: ['brown'],
      })
    }

    reset({ name: '' })
    onClose()
  }

  const handleCancel = () => {
    reset({ name: '' })
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="xs">
      <DialogTitle>{isEdit ? 'Редактировать лошадь' : 'Добавить лошадь'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Controller
            name="name"
            control={control}
            rules={{
              required: 'Имя лошади обязательно',
              minLength: {
                value: 2,
                message: 'Имя должно содержать минимум 2 символа',
              },
            }}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.name}>
                <TextField
                  {...field}
                  autoFocus
                  margin="dense"
                  label="Имя лошади"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </FormControl>
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="inherit">
            Отмена
          </Button>
          <Button type="submit" color="primary" variant="contained">
            {isEdit ? 'Сохранить' : 'Добавить'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export const HorsesPage: FC = observer(() => {
  const { horses, removeHorse } = HorsesController
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingHorse, setEditingHorse] = useState<Horse | undefined>(undefined)

  const handleAddHorse = () => {
    setEditingHorse(undefined)
    setDialogOpen(true)
  }

  const handleEditHorse = (horse: Horse) => {
    setEditingHorse(horse)
    setDialogOpen(true)
  }

  const handleDeleteHorse = (id: Horse['id']) => {
    if (window.confirm('Вы уверены, что хотите удалить эту лошадь?')) {
      removeHorse(id)
    }
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
  }

  const getHorseIcon = (id: string | number) => {
    const index = typeof id === 'number'
      ? (id % 3) + 1
      : Number.parseInt(String(id).substr(-1), 10) % 3 + 1

    return publicUrl(`assets/png2svg/horse${index}.svg`)
  }

  return (
    <Page>
      <Container maxWidth="sm" sx={{ py: 2, height: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h1">
            Лошади
          </Typography>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            color="primary"
            onClick={handleAddHorse}
          >
            Добавить
          </Button>
        </Box>

        <List sx={{ flex: 1, overflow: 'auto' }}>
          {horses.length > 0
            ? (
                horses.map(horse => (
                  <ListItem
                    key={horse.id}
                    divider
                    sx={{ borderRadius: 2, mb: 1, bgcolor: 'background.paper' }}
                  >
                    <ListItemAvatar>
                      <Avatar src={getHorseIcon(horse.id)} alt={horse.name} sx={{ width: 40, height: 40 }} />
                    </ListItemAvatar>
                    <ListItemText primary={horse.name} />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={() => handleEditHorse(horse)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="end" onClick={() => handleDeleteHorse(horse.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))
              )
            : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Typography variant="body1" color="text.secondary">
                    Нет добавленных лошадей
                  </Typography>
                </Box>
              )}
        </List>
      </Container>

      <HorseFormDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        horse={editingHorse}
        isEdit={!!editingHorse}
      />
    </Page>
  )
})
