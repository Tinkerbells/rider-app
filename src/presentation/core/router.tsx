import { createHashRouter, Navigate, Outlet, RouterProvider } from 'react-router'

import { root } from '@/config/navigation/routes'

import { NavigationMenu } from '../ui'
import { tasksPageRoute } from '../tasks/tasks.route'
import { horsesPageRoute } from '../horses/horses.route'
import { schedulePageRoute } from '../schedule/schedule.route'

function MainLayout() {
  return (
    <>
      <Outlet />
      <NavigationMenu />
    </>
  )
}

const browserRouter = createHashRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      schedulePageRoute,
      horsesPageRoute,
      tasksPageRoute,
      { path: '*', element: <Navigate to={root.$path()} replace /> },
    ],
  },
])

export function BrowserRouter() {
  return <RouterProvider router={browserRouter} />
}
