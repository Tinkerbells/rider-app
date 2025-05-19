import type {
  SelectChangeEvent,
} from '@mui/material'

import { useEffect, useState } from 'react'
import {
  Box,
  Chip,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material'

import { tasksStore } from '@/stores'

interface TaskSelectorProps {
  value: string[]
  onChange: (taskIds: string[]) => void
  label?: string
  error?: boolean
  helperText?: string
  required?: boolean
}

export function TaskSelector({
  value,
  onChange,
  label = 'Задачи',
  error = false,
  helperText,
  required = false,
}: TaskSelectorProps) {
  const { tasks, loading } = tasksStore
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>(value || [])

  useEffect(() => {
    setSelectedTaskIds(value || [])
  }, [value])

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const newValue = event.target.value as string[]
    setSelectedTaskIds(newValue)
    onChange(newValue)
  }

  return (
    <FormControl fullWidth error={error} required={required}>
      <InputLabel>{label}</InputLabel>
      <Select
        multiple
        value={selectedTaskIds}
        onChange={handleChange}
        input={<OutlinedInput label={label} />}
        disabled={loading}
        renderValue={selected => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((taskId) => {
              const task = tasks.find(t => t.id === taskId)
              return (
                <Chip
                  key={taskId}
                  label={task?.title || taskId}
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
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  )
}
