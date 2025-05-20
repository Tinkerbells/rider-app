import { CircularProgress, Container } from '@mui/material'

export function PageLoader() {
  return (
    <Container maxWidth="sm" sx={{ py: 2, height: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <CircularProgress color="inherit" />
    </Container>
  )
}
