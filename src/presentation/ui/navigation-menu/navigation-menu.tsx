import { startTransition, useState } from 'react'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import { useLocation, useNavigate } from 'react-router'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import { BottomNavigation, BottomNavigationAction } from '@mui/material'

import { root } from '@/config/navigation/routes'

export function NavigationMenu() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [current, setCurrent] = useState(pathname)
  const handleChange = (_: React.SyntheticEvent, value: string) => {
    startTransition(() => {
      setCurrent(value)
      navigate(value)
    })
  }
  return (
    <BottomNavigation
      value={current}
      onChange={handleChange}
    >
      <BottomNavigationAction value={root.$path()} label="Расписание" icon={<CalendarMonthIcon />} />
      <BottomNavigationAction value={root.horses.$path()} label="Лошадки" icon={<TaskAltIcon />} />
      <BottomNavigationAction value={root.tasks.$path()} label="Задачи" icon={<TaskAltIcon />} />
    </BottomNavigation>
  )
}
