import { Box, Container, Paper, Skeleton } from '@mui/material'

export function TasksSkeleton() {
  return (
    <Container maxWidth="sm" sx={{ py: 2, height: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column' }}>
      <Paper elevation={0} sx={{ p: 2, mb: 2, borderRadius: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Skeleton variant="text" width={100} height={40} />
        </Box>
      </Paper>

      <Box sx={{ flex: 1, overflow: 'auto', mb: 2, px: 1 }}>
        {Array.from({ length: 5 }).fill(0).map((_, index) => (
          <Paper
            key={index}
            elevation={2}
            sx={{
              m: 1,
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
              }}
            >
              <Skeleton variant="rounded" width={120} height={32} />
              <Skeleton variant="circular" width={24} height={24} />
            </Box>
          </Paper>
        ))}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Skeleton variant="circular" width={56} height={56} />
      </Box>
    </Container>
  )
}
