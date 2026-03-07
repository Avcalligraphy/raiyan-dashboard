// React Imports
import { useState, useMemo } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TablePagination from '@mui/material/TablePagination'
import Divider from '@mui/material/Divider'

// Third-party Imports
// (no third-party imports needed for now)

// Component Imports
import OptionMenu from '@core/components/option-menu'

type GalleryItem = {
  id: string
  media_url: string
  media_type: 'image' | 'video' | 'document'
  created_at: string
}

type Gallery = {
  id: string
  album_name: string
  departure_city: string
  departure_date?: string
  is_published: boolean
  source: 'galleries' | 'packages' | 'testimonials' | 'blog'
  items_count: number
  thumbnail_url?: string
  items?: GalleryItem[]
  created_at: string
}

type Props = {
  filters: {
    source: string
    mediaType: string
    search: string
  }
}

// Mock data - akan diganti dengan data dari API nanti
const mockGalleries: Gallery[] = [
  {
    id: '1',
    album_name: 'Umrah Maret 2025 - Jakarta',
    departure_city: 'Jakarta',
    departure_date: '2025-03-15',
    is_published: true,
    source: 'galleries',
    items_count: 45,
    thumbnail_url: '/images/apps/ecommerce/product-1.png',
    created_at: '2025-01-15'
  },
  {
    id: '2',
    album_name: 'Umrah Premium Package',
    departure_city: 'Surabaya',
    departure_date: '2025-04-20',
    is_published: true,
    source: 'packages',
    items_count: 32,
    thumbnail_url: '/images/apps/ecommerce/product-2.png',
    created_at: '2025-01-20'
  },
  {
    id: '3',
    album_name: 'Customer Testimonials',
    departure_city: 'Bandung',
    is_published: true,
    source: 'testimonials',
    items_count: 28,
    thumbnail_url: '/images/apps/ecommerce/product-3.png',
    created_at: '2025-01-25'
  },
  {
    id: '4',
    album_name: 'Blog Media Gallery',
    departure_city: 'Yogyakarta',
    is_published: false,
    source: 'blog',
    items_count: 15,
    thumbnail_url: '/images/apps/ecommerce/product-4.png',
    created_at: '2025-02-01'
  },
  {
    id: '5',
    album_name: 'Umrah Ramadhan 2025',
    departure_city: 'Medan',
    departure_date: '2025-03-01',
    is_published: true,
    source: 'galleries',
    items_count: 67,
    thumbnail_url: '/images/apps/ecommerce/product-5.png',
    created_at: '2025-02-05'
  },
  {
    id: '6',
    album_name: 'Hotel Gallery',
    departure_city: 'Bali',
    is_published: true,
    source: 'packages',
    items_count: 23,
    thumbnail_url: '/images/apps/ecommerce/product-6.png',
    created_at: '2025-02-10'
  }
]

const GalleryGrid = ({ filters }: Props) => {
  // States
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(12)
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Filter galleries
  const filteredGalleries = useMemo(() => {
    return mockGalleries.filter(gallery => {
      // Filter by source
      if (filters.source !== 'all' && gallery.source !== filters.source) {
        return false
      }

      // Filter by search
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch =
          gallery.album_name.toLowerCase().includes(searchLower) ||
          gallery.departure_city.toLowerCase().includes(searchLower) ||
          (gallery.departure_date && gallery.departure_date.includes(searchLower))
        if (!matchesSearch) {
          return false
        }
      }

      return true
    })
  }, [filters])

  // Pagination
  const paginatedGalleries = useMemo(() => {
    const start = page * rowsPerPage
    return filteredGalleries.slice(start, start + rowsPerPage)
  }, [filteredGalleries, page, rowsPerPage])

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleGalleryClick = (gallery: Gallery) => {
    setSelectedGallery(gallery)
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setSelectedGallery(null)
  }

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'galleries':
        return 'primary'
      case 'packages':
        return 'success'
      case 'testimonials':
        return 'warning'
      case 'blog':
        return 'info'
      default:
        return 'default'
    }
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'galleries':
        return 'ri-gallery-line'
      case 'packages':
        return 'ri-box-3-line'
      case 'testimonials':
        return 'ri-star-line'
      case 'blog':
        return 'ri-article-line'
      default:
        return 'ri-image-line'
    }
  }

  return (
    <>
      <Card>
        <div className='flex justify-between items-center p-5'>
          <Typography variant='h5'>
            Galleries ({filteredGalleries.length})
          </Typography>
          <Button variant='contained' startIcon={<i className='ri-add-line' />}>
            Add Gallery
          </Button>
        </div>
        {paginatedGalleries.length === 0 ? (
          <div className='flex flex-col items-center justify-center p-12 gap-4'>
            <i className='ri-image-line text-[64px] text-textDisabled' />
            <Typography variant='h6' color='text.secondary'>
              No galleries found
            </Typography>
            <Typography variant='body2' color='text.disabled'>
              Try adjusting your filters or add a new gallery
            </Typography>
          </div>
        ) : (
          <>
            <Grid container spacing={4} className='p-5'>
              {paginatedGalleries.map(gallery => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={gallery.id}>
                  <Card
                    className='cursor-pointer hover:shadow-lg transition-shadow'
                    onClick={() => handleGalleryClick(gallery)}
                  >
                    <div className='relative'>
                      <CardMedia
                        component='img'
                        height='200'
                        image={gallery.thumbnail_url || '/images/apps/ecommerce/product-1.png'}
                        alt={gallery.album_name}
                        className='object-cover'
                      />
                      <div className='absolute top-2 end-2'>
                        <Chip
                          label={gallery.is_published ? 'Published' : 'Draft'}
                          size='small'
                          color={gallery.is_published ? 'success' : 'default'}
                          variant='filled'
                        />
                      </div>
                      <div className='absolute top-2 start-2'>
                        <Chip
                          icon={<i className={getSourceIcon(gallery.source)} />}
                          label={gallery.source}
                          size='small'
                          color={getSourceColor(gallery.source) as any}
                          variant='filled'
                        />
                      </div>
                    </div>
                    <CardContent>
                      <div className='flex flex-col gap-2'>
                        <Typography variant='h6' className='line-clamp-2'>
                          {gallery.album_name}
                        </Typography>
                        <div className='flex items-center gap-2 text-textSecondary'>
                          <i className='ri-map-pin-line text-sm' />
                          <Typography variant='body2'>{gallery.departure_city}</Typography>
                        </div>
                        {gallery.departure_date && (
                          <div className='flex items-center gap-2 text-textSecondary'>
                            <i className='ri-calendar-line text-sm' />
                            <Typography variant='body2'>{gallery.departure_date}</Typography>
                          </div>
                        )}
                        <div className='flex items-center justify-between mt-2'>
                          <div className='flex items-center gap-2'>
                            <i className='ri-image-line text-textSecondary' />
                            <Typography variant='body2' color='text.secondary'>
                              {gallery.items_count} items
                            </Typography>
                          </div>
                          <OptionMenu
                            iconButtonProps={{ onClick: e => e.stopPropagation() }}
                            options={[
                              { text: 'View Details', icon: 'ri-eye-line' },
                              { text: 'Edit', icon: 'ri-pencil-line' },
                              { text: 'Delete', icon: 'ri-delete-bin-line', menuItemProps: { className: 'text-error' } }
                            ]}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <TablePagination
              component='div'
              count={filteredGalleries.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[12, 24, 48]}
            />
          </>
        )}
      </Card>

      {/* Gallery Detail Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth='md'
        fullWidth
      >
        <DialogTitle>
          <div className='flex items-center justify-between'>
            <Typography variant='h5'>{selectedGallery?.album_name}</Typography>
            <IconButton size='small' onClick={handleCloseDialog}>
              <i className='ri-close-line' />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          {selectedGallery && (
            <div className='flex flex-col gap-4'>
              <div className='flex flex-wrap gap-2'>
                <Chip
                  icon={<i className={getSourceIcon(selectedGallery.source)} />}
                  label={selectedGallery.source}
                  size='small'
                  color={getSourceColor(selectedGallery.source) as any}
                />
                <Chip
                  label={selectedGallery.is_published ? 'Published' : 'Draft'}
                  size='small'
                  color={selectedGallery.is_published ? 'success' : 'default'}
                />
              </div>
              <div className='flex flex-col gap-2'>
                <div className='flex items-center gap-2'>
                  <i className='ri-map-pin-line' />
                  <Typography variant='body1'>
                    <strong>City:</strong> {selectedGallery.departure_city}
                  </Typography>
                </div>
                {selectedGallery.departure_date && (
                  <div className='flex items-center gap-2'>
                    <i className='ri-calendar-line' />
                    <Typography variant='body1'>
                      <strong>Departure Date:</strong> {selectedGallery.departure_date}
                    </Typography>
                  </div>
                )}
                <div className='flex items-center gap-2'>
                  <i className='ri-image-line' />
                  <Typography variant='body1'>
                    <strong>Total Items:</strong> {selectedGallery.items_count}
                  </Typography>
                </div>
                <div className='flex items-center gap-2'>
                  <i className='ri-time-line' />
                  <Typography variant='body1'>
                    <strong>Created:</strong> {selectedGallery.created_at}
                  </Typography>
                </div>
              </div>
              <Divider />
              <Typography variant='body2' color='text.secondary'>
                Gallery items will be displayed here when integrated with the backend API.
              </Typography>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          <Button variant='contained' onClick={handleCloseDialog}>
            View All Items
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default GalleryGrid

