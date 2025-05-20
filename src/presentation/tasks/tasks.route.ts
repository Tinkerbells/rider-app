import type { RouteObject } from 'react-router'

import { createElement, lazy } from 'react'
import { withErrorBoundary } from 'react-error-boundary'

import { root } from '@/config/navigation/routes'

import { TasksSkeleton } from './tasks.skeleton'
import { compose, ErrorHandler, logError, withSuspense } from '../core/react'

const TasksPage = lazy(() =>
  import('./tasks.page').then(module => ({ default: module.TasksPage })),
)

const enhance = compose(
  component => withSuspense(component, { FallbackComponent: TasksSkeleton }),
  component =>
    withErrorBoundary(component, {
      FallbackComponent: ErrorHandler,
      onError: logError,
    }),
)

export const tasksPageRoute: RouteObject = {
  path: root.tasks.$path(),
  element: createElement(enhance(TasksPage)),
}
