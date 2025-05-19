import type { RouteObject } from 'react-router'

import { createElement, lazy } from 'react'
import { CircularProgress } from '@mui/material'
import { withErrorBoundary } from 'react-error-boundary'

import { root } from '@/config/navigation/routes.ts'

import { compose, ErrorHandler, logError, withSuspense } from '../core/react'

const HomePage = lazy(() =>
  import('./home.page.tsx').then(module => ({ default: module.HomePage })),
)

const enhance = compose(
  component => withSuspense(component, { FallbackComponent: CircularProgress }),
  component =>
    withErrorBoundary(component, {
      FallbackComponent: ErrorHandler,
      onError: logError,
    }),
)

export const homePageRoute: RouteObject = {
  path: root.$path(),
  element: createElement(enhance(HomePage)),
}
