import type { RouteObject } from 'react-router'

import { createElement, lazy } from 'react'
import { withErrorBoundary } from 'react-error-boundary'

import { root } from '@/config/navigation/routes.ts'

import { ScheduleSkeleton } from './schedule.skeleton.tsx'
import { compose, ErrorHandler, logError, withSuspense } from '../core/react/index.ts'

const SchedulePage = lazy(() =>
  import('./schedule.page.tsx').then(module => ({ default: module.SchedulePage })),
)

const enhance = compose(
  component => withSuspense(component, { FallbackComponent: ScheduleSkeleton }),
  component =>
    withErrorBoundary(component, {
      FallbackComponent: ErrorHandler,
      onError: logError,
    }),
)

export const schedulePageRoute: RouteObject = {
  path: root.$path(),
  element: createElement(enhance(SchedulePage)),
}
