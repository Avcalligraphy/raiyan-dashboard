'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'
import { useForm, Controller } from 'react-hook-form'

// Type Imports
import type { Testimonial, TestimonialMediaType, CreateTestimonialPayload } from '@/types/testimonialTypes'

// Service Imports
import { testimonialService } from '@/services/testimonialService'

type Props = {
  open: boolean
  handleClose: () => void
  testimonial?: Testimonial | null
  onSuccess?: () => void
}

const MEDIA_TYPES: { value: TestimonialMediaType; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'video', label: 'Video' },
  { value: 'image', label: 'Image' },
]

const AddTestimonialDrawer = (props: Props) => {
  const { open, handleClose, testimonial, onSuccess } = props
  const isEditMode = !!testimonial

  const {
    control,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTestimonialPayload>({
    defaultValues: {
      name: '',
      city: '',
      media_type: 'text',
      content: '',
      media_url: '',
      rating: 5,
      is_published: false,
    },
  })

  const mediaType = watch('media_type')

  useEffect(() => {
    if (testimonial) {
      reset({
        name: testimonial.name,
        city: testimonial.city,
        media_type: testimonial.media_type,
        content: testimonial.content ?? '',
        media_url: testimonial.media_url ?? '',
        rating: testimonial.rating,
        is_published: testimonial.is_published,
      })
    } else {
      reset({
        name: '',
        city: '',
        media_type: 'text',
        content: '',
        media_url: '',
        rating: 5,
        is_published: false,
      })
    }
  }, [testimonial, reset, open])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (data: CreateTestimonialPayload) => {
    setError(null)
    setLoading(true)
    try {
      const payload: CreateTestimonialPayload = {
        name: data.name.trim(),
        city: data.city.trim(),
        media_type: data.media_type,
        content: data.content.trim(),
        rating: Math.min(5, Math.max(1, data.rating)),
        is_published: data.is_published,
      }
      if (data.media_type === 'video' || data.media_type === 'image') {
        payload.media_url = (data.media_url ?? '').trim()
        if (!payload.media_url) {
          setError('Media URL is required for video or image type.')
          setLoading(false)
          return
        }
      }
      if (isEditMode && testimonial) {
        await testimonialService.update(testimonial.id, payload)
      } else {
        await testimonialService.create(payload)
      }
      handleClose()
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save testimonial.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setError(null)
    handleClose()
  }

  return (
    <Drawer
      open={open}
      anchor="right"
      variant="temporary"
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 5 }}>
        <Typography variant="h5">
          {isEditMode ? 'Edit Testimonial' : 'Add Testimonial'}
        </Typography>
        <IconButton size="small" onClick={handleReset}>
          <i className="ri-close-line" style={{ fontSize: '1.5rem' }} />
        </IconButton>
      </Box>
      <Divider />
      <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>
        <Box sx={{ p: 5 }}>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
          >
            {error && (
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            <Controller
              name="name"
              control={control}
              rules={{ required: 'Name is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Name"
                  placeholder="Ahmad Rizki"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />

            <Controller
              name="city"
              control={control}
              rules={{ required: 'City is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="City"
                  placeholder="Jakarta"
                  error={!!errors.city}
                  helperText={errors.city?.message}
                />
              )}
            />

            <Controller
              name="media_type"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel id="media_type">Media type</InputLabel>
                  <Select
                    {...field}
                    labelId="media_type"
                    label="Media type"
                  >
                    {MEDIA_TYPES.map((o) => (
                      <MenuItem key={o.value} value={o.value}>
                        {o.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />

            <Controller
              name="content"
              control={control}
              rules={{ required: 'Content is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Content"
                  placeholder="Pengalaman umrah kami sangat memuaskan."
                  multiline
                  rows={3}
                  error={!!errors.content}
                  helperText={errors.content?.message}
                />
              )}
            />

            {(mediaType === 'video' || mediaType === 'image') && (
              <Controller
                name="media_url"
                control={control}
                rules={{ required: 'Media URL is required for video/image' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Media URL"
                    placeholder="https://..."
                    error={!!errors.media_url}
                    helperText={errors.media_url?.message}
                  />
                )}
              />
            )}

            <Controller
              name="rating"
              control={control}
              rules={{
                required: 'Rating is required',
                min: { value: 1, message: 'Min 1' },
                max: { value: 5, message: 'Max 5' },
              }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.rating}>
                  <InputLabel id="rating">Rating (1–5)</InputLabel>
                  <Select
                    {...field}
                    labelId="rating"
                    label="Rating (1–5)"
                    value={field.value ?? 5}
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <MenuItem key={n} value={n}>
                        {n} star{n > 1 ? 's' : ''}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />

            <Controller
              name="is_published"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={!!field.value}
                      onChange={(_, checked) => field.onChange(checked)}
                    />
                  }
                  label="Published"
                />
              )}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
              <Button
                variant="contained"
                type="submit"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={16} /> : null}
              >
                {isEditMode ? 'Update' : 'Add'} Testimonial
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleReset} disabled={loading}>
                Discard
              </Button>
            </Box>
          </Box>
        </Box>
      </PerfectScrollbar>
    </Drawer>
  )
}

export default AddTestimonialDrawer
