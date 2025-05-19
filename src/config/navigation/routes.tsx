import type { ComponentType, JSX } from 'react'

import { HomePage } from '@/presentation/home/home-page'

interface Route {
  path: string
  Component: ComponentType
  title?: string
  icon?: JSX.Element
}

export const routes: Route[] = [
  { path: '/', Component: HomePage },
]
