import { useMemo } from 'react'
import { CssBaseline } from '@mui/material'
import { AppRoot } from '@telegram-apps/telegram-ui'
import { withErrorBoundary } from 'react-error-boundary'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { isMiniAppDark, retrieveLaunchParams, useSignal } from '@telegram-apps/sdk-react'

import { BrowserRouter } from './router'
import { compose, ErrorHandler, logError } from './react'

const enhance = compose(component =>
  withErrorBoundary(component, {
    FallbackComponent: ErrorHandler,
    onError: logError,
  }),
)

export const App = enhance(() => {
  const lp = useMemo(() => retrieveLaunchParams(), [])
  const isDark = useSignal(isMiniAppDark)

  return (
    <AppRoot
      appearance={isDark ? 'dark' : 'light'}
      platform={['macos', 'ios'].includes(lp.tgWebAppPlatform) ? 'ios' : 'base'}
    >
      <BrowserRouter />
      <CssBaseline />
    </AppRoot>
  )
})
