import { createHashRouter, Outlet, RouterProvider } from 'react-router'

import { NavigationMenu } from '../ui'
import { homePageRoute } from '../home/home.route'
import { tasksPageRoute } from '../tasks/tasks.route'
import { horsesPageRoute } from '../horses/horses.route'

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
      homePageRoute,
      horsesPageRoute,
      tasksPageRoute,
    ],
  },
])

export function BrowserRouter() {
  return <RouterProvider router={browserRouter} />
}
