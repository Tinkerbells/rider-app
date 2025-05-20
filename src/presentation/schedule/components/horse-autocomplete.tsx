import { useEffect, useState } from 'react'
import { Autocomplete, Box, TextField } from '@mui/material'

import type { Horse } from '@/domain/horse.domain'

interface HorseAutocompleteProps {
  horses: Horse[]
  loading: boolean
  value: string | number | null
  onChange: (value: string | number) => void
  label?: string
  error?: boolean
  helperText?: string
  required?: boolean
}

export function HorseAutocomplete({
  value,
  onChange,
  label = 'Лошадь',
  error = false,
  helperText,
  required = false,
  horses,
  loading,
}: HorseAutocompleteProps) {
  const [inputValue, setInputValue] = useState('')
  const [selectedHorse, setSelectedHorse] = useState<Horse | null>(null)

  // Находим выбранную лошадь при загрузке компонента или изменении value
  useEffect(() => {
    if (value && horses.length > 0) {
      const horse = horses.find(h => h.id === value) || null
      setSelectedHorse(horse)
    }
    else {
      setSelectedHorse(null)
    }
  }, [value, horses])

  return (
    <Autocomplete
      fullWidth
      loading={loading}
      disabled={loading}
      options={horses}
      value={selectedHorse}
      inputValue={inputValue}
      getOptionLabel={option => option.name}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderOption={(props, option) => (
        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
          {/* <Avatar */}
          {/*   src={getHorseIcon(option.id)} */}
          {/*   alt={option.name} */}
          {/*   sx={{ width: 30, height: 30, mr: 2 }} */}
          {/* /> */}
          {option.name}
        </Box>
      )}
      onChange={(_, newValue) => {
        if (newValue) {
          onChange(newValue.id)
          setSelectedHorse(newValue)
        }
        else {
          onChange('')
          setSelectedHorse(null)
        }
      }}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue)
      }}
      renderInput={params => (
        <TextField
          {...params}
          required={required}
          label={label}
          error={error}
          helperText={helperText}
        />
      )}
    />
  )
}
