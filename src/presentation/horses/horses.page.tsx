import type { FC } from 'react'

import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import SearchIcon from '@mui/icons-material/Search'
import { Controller, useForm } from 'react-hook-form'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  FormControl,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material'

import type { Horse } from '@/domain/horse.domain'

import { HorsesController } from '@/controllers'

import { Page } from '../core/page'
import horseIcon from '../../../assets/horse.png'

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

  useEffect(() => {
    if (horse && isEdit) {
      reset({ name: horse.name })
    }
  }, [horse, isEdit, reset])

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

  const handleDelete = () => {
    if (horse) {
      HorsesController.removeHorse(horse.id)
      reset({ name: '' })
      onClose()
    }
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
                  value={field.value}
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

export const HorsesPage: FC = observer(() => {
  const { horses } = HorsesController
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingHorse, setEditingHorse] = useState<Horse | undefined>(undefined)
  // Добавляем состояние для поискового запроса
  const [searchQuery, setSearchQuery] = useState('')
  // Добавляем состояние для отфильтрованных лошадей
  const [filteredHorses, setFilteredHorses] = useState<Horse[]>(horses)

  // Обновляем список отфильтрованных лошадей при изменении исходного списка или поискового запроса
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredHorses(horses)
    }
    else {
      const query = searchQuery.toLowerCase()
      setFilteredHorses(horses.filter(horse =>
        horse.name.toLowerCase().includes(query),
      ))
    }
  }, [horses, searchQuery])

  const handleAddHorse = () => {
    setEditingHorse(undefined)
    setDialogOpen(true)
  }

  const handleEditHorse = (horse: Horse) => {
    setEditingHorse(horse)
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  return (
    <Page>
      <Container maxWidth="sm" sx={{ py: 2, height: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column' }}>
        <Paper elevation={0} sx={{ p: 2, mb: 2, borderRadius: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h5" component="h1" fontWeight="bold" align="center">
              Лошадки
            </Typography>
          </Box>
        </Paper>

        {/* Добавляем поисковое поле */}
        <Box sx={{ mb: 2, px: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Поиск лошадей..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            size="small"
          />
        </Box>

        <Box sx={{ flex: 1, overflow: 'auto', mb: 2, px: 1 }}>
          {filteredHorses.length > 0
            ? (
                <Grid container spacing={2} columns={12}>
                  {filteredHorses.map(horse => (
                    <Grid key={horse.id} size={{ xs: 6 }}>
                      <Card
                        sx={{ 'borderRadius': 2, 'height': '100%', 'display': 'flex', 'flexDirection': 'column', 'transition': 'all 0.2s ease', '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 4,
                        }, 'overflow': 'hidden' }}
                        onClick={() => handleEditHorse(horse)}
                      >
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 1, flexGrow: 1 }}>
                          <Avatar src={horseIcon} alt={horse.name} sx={{ width: 60, height: 60, mb: 1 }} />
                          <Typography variant="h6" align="center">
                            {horse.name}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )
            : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Typography variant="body1" color="text.secondary">
                    {searchQuery ? 'Не найдено лошадей по запросу' : 'Нет добавленных лошадей'}
                  </Typography>
                </Box>
              )}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Fab
            color="primary"
            aria-label="add"
            onClick={handleAddHorse}
            sx={{ position: 'relative', zIndex: 1 }}
          >
            <AddIcon />
          </Fab>
        </Box>
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
