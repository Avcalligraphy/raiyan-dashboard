// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'

// Third-party Imports
import type { TextFieldProps } from '@mui/material/TextField'

type FilterType = {
  source: string
  mediaType: string
  search: string
}

type Props = {
  filters: FilterType
  onFilterChange: (filters: FilterType) => void
}

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<TextFieldProps, 'onChange'>) => {
  const [value, setValue] = useState(initialValue)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <TextField {...props} value={value} onChange={e => setValue(e.target.value)} size='small' />
}

const GalleryFilters = ({ filters, onFilterChange }: Props) => {
  const handleSourceChange = (source: string) => {
    onFilterChange({ ...filters, source })
  }

  const handleMediaTypeChange = (mediaType: string) => {
    onFilterChange({ ...filters, mediaType })
  }

  const handleSearchChange = (search: string) => {
    onFilterChange({ ...filters, search })
  }

  const handleReset = () => {
    onFilterChange({
      source: 'all',
      mediaType: 'all',
      search: ''
    })
  }

  const hasActiveFilters = filters.source !== 'all' || filters.mediaType !== 'all' || filters.search !== ''

  return (
    <Card>
      <CardHeader title='Filters' />
      <Divider />
      <div className='flex flex-col gap-4 p-5'>
        <div className='flex flex-col sm:flex-row gap-4'>
          <FormControl size='small' className='flex-auto'>
            <InputLabel id='source-select'>Source</InputLabel>
            <Select
              labelId='source-select'
              id='source-select'
              value={filters.source}
              label='Source'
              onChange={e => handleSourceChange(e.target.value)}
            >
              <MenuItem value='all'>All Sources</MenuItem>
              <MenuItem value='galleries'>Galleries</MenuItem>
              <MenuItem value='packages'>Packages</MenuItem>
              <MenuItem value='testimonials'>Testimonials</MenuItem>
              <MenuItem value='blog'>Blog</MenuItem>
            </Select>
          </FormControl>
          <FormControl size='small' className='flex-auto'>
            <InputLabel id='media-type-select'>Media Type</InputLabel>
            <Select
              labelId='media-type-select'
              id='media-type-select'
              value={filters.mediaType}
              label='Media Type'
              onChange={e => handleMediaTypeChange(e.target.value)}
            >
              <MenuItem value='all'>All Types</MenuItem>
              <MenuItem value='image'>Images</MenuItem>
              <MenuItem value='video'>Videos</MenuItem>
              <MenuItem value='document'>Documents</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center'>
          <DebouncedInput
            value={filters.search ?? ''}
            onChange={value => handleSearchChange(String(value))}
            placeholder='Search by album name, city, or date...'
            className='flex-auto max-sm:is-full'
          />
          {hasActiveFilters && (
            <Button variant='outlined' color='secondary' onClick={handleReset} className='max-sm:is-full'>
              Reset Filters
            </Button>
          )}
        </div>
        {hasActiveFilters && (
          <div className='flex flex-wrap gap-2'>
            {filters.source !== 'all' && (
              <Chip
                label={`Source: ${filters.source}`}
                onDelete={() => handleSourceChange('all')}
                size='small'
                variant='outlined'
              />
            )}
            {filters.mediaType !== 'all' && (
              <Chip
                label={`Type: ${filters.mediaType}`}
                onDelete={() => handleMediaTypeChange('all')}
                size='small'
                variant='outlined'
              />
            )}
            {filters.search && (
              <Chip
                label={`Search: ${filters.search}`}
                onDelete={() => handleSearchChange('')}
                size='small'
                variant='outlined'
              />
            )}
          </div>
        )}
      </div>
    </Card>
  )
}

export default GalleryFilters

