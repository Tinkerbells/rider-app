import { Avatar, Box, Container, Grid, Paper, Skeleton } from '@mui/material'

export function HorsesSkeleton() {
  return (
    <Container maxWidth="sm" sx={{ py: 2, height: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column' }}>
      <Paper elevation={0} sx={{ p: 2, mb: 2, borderRadius: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Skeleton variant="text" width={120} height={40} />
        </Box>
      </Paper>

      <Box sx={{ mb: 2, px: 1 }}>
        <Skeleton variant="rounded" height={40} width="100%" />
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto', mb: 2, px: 1 }}>
        <Grid container spacing={2} columns={12}>
          {Array.from({ length: 6 }).fill(0).map((_, index) => (
            <Grid key={index} size={6}>
              <Paper
                sx={{
                  borderRadius: 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  p: 2,
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 1 }}>
                  <Skeleton variant="circular">
                    <Avatar sx={{ width: 60, height: 60 }} />
                  </Skeleton>
                  <Skeleton variant="text" width={80} sx={{ mt: 1 }} />
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Skeleton variant="circular" width={56} height={56} />
      </Box>
    </Container>
  )
}
