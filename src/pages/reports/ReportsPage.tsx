

// MUI Imports
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

const ReportsPage = () => {
  return (
    <Box className='flex flex-col gap-4 p-6'>
      <Typography variant='h4' className='font-medium'>
        Investment Report
      </Typography>
      <Typography variant='body1' color='text.secondary'>
        View investment reports and analytics
      </Typography>
    </Box>
  )
}

export default ReportsPage

