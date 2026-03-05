

// MUI Imports
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

const DashboardPage = () => {
  return (
    <Box className='flex flex-col gap-4 p-6'>
      <Typography variant='h4' className='font-medium'>
        Overview
      </Typography>
      <Typography variant='body1' color='text.secondary'>
        Welcome to your EV Charging Dashboard
      </Typography>
    </Box>
  )
}

export default DashboardPage

