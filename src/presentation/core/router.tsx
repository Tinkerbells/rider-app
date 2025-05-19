import { CircularProgress } from '@mui/material'
import { createHashRouter, Outlet, RouterProvider } from 'react-router'

import { NavigationMenu } from '../ui'
import { compose, withSuspense } from './react'
import { homePageRoute } from '../home/home.route'

const enhance = compose(component =>
  withSuspense(component, { FallbackComponent: CircularProgress }),
)

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
    children: [homePageRoute],
  },
])

export function BrowserRouter() {
  return <RouterProvider router={browserRouter} />
}
