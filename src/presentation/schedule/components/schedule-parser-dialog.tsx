import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material'

import { ScheduleParserService } from '@/services/schedule-parser.service'
import { HorseEventsContoller, HorsesController, TasksController } from '@/controllers'

interface ScheduleParserDialogProps {
  open: boolean
  onClose: () => void
}

export const ScheduleParserDialog = observer(({ open, onClose }: ScheduleParserDialogProps) => {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    success?: boolean
    addedEvents?: number
    addedHorses?: number
    error?: any
  } | null>(null)

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
  }

  const handleSubmit = async () => {
    if (!text.trim())
      return

    setLoading(true)
    setResult(null)

    try {
      const parseResult = await ScheduleParserService.parseScheduleText(
        text,
        HorsesController.horses,
        TasksController.tasks,
        HorseEventsContoller.events,
        HorsesController.addHorse.bind(HorsesController),
        HorseEventsContoller.addEvent.bind(HorseEventsContoller),
      )

      setResult(parseResult)

      if (parseResult.success) {
        // Автоматически закрыть диалог через 2 секунды при успешном парсинге
        setTimeout(() => {
          onClose()
          setText('')
          setResult(null)
        }, 2000)
      }
    }
    catch (error) {
      setResult({ success: false, error })
    }
    finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setText('')
    setResult(null)
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Парсинг расписания</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Вставьте текст расписания для автоматического создания событий
          </Typography>
          <TextField
            autoFocus
            fullWidth
            multiline
            rows={10}
            variant="outlined"
            placeholder="Например:
11:00 Купер собрать и через час разобрать
13:00 Хелемендик Варвара помощь в сборе
11/12 Дивный миг сбор/разбор"
            value={text}
            onChange={handleTextChange}
            disabled={loading}
          />
        </Box>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress />
          </Box>
        )}

        {result && (
          <Box sx={{ my: 2 }}>
            {result.success
              ? (
                  <Alert severity="success">
                    Успешно обработано! Добавлено событий:
                    {' '}
                    {result.addedEvents}
                    ,
                    новых лошадей:
                    {' '}
                    {result.addedHorses}
                  </Alert>
                )
              : (
                  <Alert severity="error">
                    Ошибка при обработке текста. Пожалуйста, проверьте формат и попробуйте снова.
                  </Alert>
                )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit" disabled={loading}>
          Отмена
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={loading || !text.trim()}
        >
          {loading ? 'Обработка...' : 'Обработать'}
        </Button>
      </DialogActions>
    </Dialog>
  )
})
