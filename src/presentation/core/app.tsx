import { withErrorBoundary } from 'react-error-boundary'
import { CssBaseline, ThemeProvider } from '@mui/material'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { QueryClientProvider } from '@tanstack/react-query'

import { BrowserRouter } from './router'
import { defaultTheme } from './themes/default'
import { queryClient } from './react/query-client'
import { compose, ErrorHandler, logError } from './react'

const enhance = compose(component =>
  withErrorBoundary(component, {
    FallbackComponent: ErrorHandler,
    onError: logError,
  }),
)

export const App = enhance(() => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={defaultTheme('light')}>
        <BrowserRouter />
        <CssBaseline />
      </ThemeProvider>
    </QueryClientProvider>
  )
})
