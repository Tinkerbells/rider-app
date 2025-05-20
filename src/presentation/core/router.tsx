import { createHashRouter, Outlet, RouterProvider } from 'react-router'

import { NavigationMenu } from '../ui'
// import { tasksPageRoute } from '../tasks/tasks.route'
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
      // tasksPageRoute,
    ],
  },
])

export function BrowserRouter() {
  return <RouterProvider router={browserRouter} />
}
