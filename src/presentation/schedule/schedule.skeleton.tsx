import { Box, Container, Paper, Skeleton, Typography } from '@mui/material'

export function ScheduleSkeleton() {
  return (
    <Container maxWidth="sm" sx={{ py: 2, height: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column' }}>
      <Paper elevation={0} sx={{ p: 2, mb: 2, borderRadius: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Skeleton variant="text" width={200} height={40} />
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Skeleton variant="text" width={120} height={40} />
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto', mb: 2, px: 1 }}>
        {/* Время события */}
        <Typography component="div" variant="h6" sx={{ mb: 1 }}>
          <Skeleton width={60} />
        </Typography>

        {/* Карточки событий */}
        {Array.from({ length: 3 }).fill(0).map((_, index) => (
          <Paper
            key={index}
            elevation={1}
            sx={{
              display: 'flex',
              p: 1.5,
              mb: 1,
              alignItems: 'center',
              borderRadius: 2,
              height: 70,
            }}
          >
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: 60,
            }}
            >
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="text" width={40} sx={{ mt: 0.5 }} />
            </Box>

            <Box sx={{ flex: 1, ml: 2 }}>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Skeleton variant="rounded" width={80} height={24} />
                <Skeleton variant="rounded" width={60} height={24} />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Skeleton variant="circular" width={24} height={24} sx={{ mr: 1 }} />
              <Skeleton variant="circular" width={30} height={30} />
            </Box>
          </Paper>
        ))}

        {/* Вторая группа времени */}
        <Typography component="div" variant="h6" sx={{ mb: 1, mt: 3 }}>
          <Skeleton width={60} />
        </Typography>

        {/* Еще карточки событий */}
        {Array.from({ length: 2 }).fill(0).map((_, index) => (
          <Paper
            key={index + 3}
            elevation={1}
            sx={{
              display: 'flex',
              p: 1.5,
              mb: 1,
              alignItems: 'center',
              borderRadius: 2,
              height: 70,
            }}
          >
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: 60,
            }}
            >
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="text" width={40} sx={{ mt: 0.5 }} />
            </Box>

            <Box sx={{ flex: 1, ml: 2 }}>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Skeleton variant="rounded" width={80} height={24} />
                <Skeleton variant="rounded" width={60} height={24} />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Skeleton variant="circular" width={24} height={24} sx={{ mr: 1 }} />
              <Skeleton variant="circular" width={30} height={30} />
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
