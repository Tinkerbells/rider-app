import type { RouteObject } from 'react-router'

import { createElement, lazy } from 'react'
import { withErrorBoundary } from 'react-error-boundary'

import { root } from '@/config/navigation/routes'

import { PageLoader } from '../ui'
import { compose, ErrorHandler, logError, withSuspense } from '../core/react'

const HorsesPage = lazy(() =>
  import('./horses.page').then(module => ({ default: module.HorsesPage })),
)

const enhance = compose(
  component => withSuspense(component, { FallbackComponent: PageLoader }),
  component =>
    withErrorBoundary(component, {
      FallbackComponent: ErrorHandler,
      onError: logError,
    }),
)

export const horsesPageRoute: RouteObject = {
  path: root.horses.$path(),
  element: createElement(enhance(HorsesPage)),
}
