// React Imports
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import GalleryStatistics from './GalleryStatistics'
import GalleryFilters from './GalleryFilters'
import GalleryGrid from './GalleryGrid'

const SiteGalleriesPage = () => {
  // States
  const [filters, setFilters] = useState({
    source: 'all',
    mediaType: 'all',
    search: ''
  })

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <GalleryStatistics />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <GalleryFilters filters={filters} onFilterChange={setFilters} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <GalleryGrid filters={filters} />
      </Grid>
    </Grid>
  )
}

export default SiteGalleriesPage
