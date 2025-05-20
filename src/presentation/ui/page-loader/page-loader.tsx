import { Backdrop, CircularProgress } from '@mui/material'

export function PageLoader() {
  return (
    <Backdrop
      open
      sx={theme => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  )
}
