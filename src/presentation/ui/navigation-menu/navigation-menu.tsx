import { startTransition, useState } from 'react'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import { useLocation, useNavigate } from 'react-router'
import HomeFilledIcon from '@mui/icons-material/HomeFilled'
import { BottomNavigation, BottomNavigationAction } from '@mui/material'

import { root } from '@/config/navigation/routes'

export function NavigationMenu() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [current, setCurrent] = useState(pathname)
  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    startTransition(() => {
      setCurrent(newValue)
      navigate(newValue)
    })
  }
  return (
    <BottomNavigation
      showLabels
      value={current}
      onChange={handleChange}
    >
      <BottomNavigationAction label="/" icon={<HomeFilledIcon />} />
      <BottomNavigationAction label={root.horses.$path()} icon={<TaskAltIcon />} />
      <BottomNavigationAction label={root.tasks.$path()} icon={<TaskAltIcon />} />
    </BottomNavigation>
  )
}
