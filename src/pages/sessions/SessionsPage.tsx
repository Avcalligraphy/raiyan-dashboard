

// MUI Imports
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

const SessionsPage = () => {
  return (
    <Box className='flex flex-col gap-4 p-6'>
      <Typography variant='h4' className='font-medium'>
        Charging Sessions
      </Typography>
      <Typography variant='body1' color='text.secondary'>
        View and manage all charging sessions
      </Typography>
    </Box>
  )
}

export default SessionsPage

