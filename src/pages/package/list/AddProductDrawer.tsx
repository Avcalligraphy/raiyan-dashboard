// React Imports
import { useState, useRef } from 'react'
import type { ChangeEvent } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import InputAdornment from '@mui/material/InputAdornment'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Box from '@mui/material/Box'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'

// Type Imports
import type { ProductType } from '@/types/apps/ecommerceTypes'

type Props = {
  open: boolean
  handleClose: () => void
  productData: ProductType[]
  setData: (data: ProductType[]) => void
}

type FormValues = {
  productName: string
  productBrand: string
  category: string
  price: string
  sku: string
  qty: string
  status: string
}

const AddProductDrawer = (props: Props) => {
  // Props
  const { open, handleClose, productData, setData } = props

  // States
  const [fileName, setFileName] = useState('')
  const [stock, setStock] = useState(true)

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Hooks
  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      productName: '',
      productBrand: '',
      category: '',
      price: '',
      sku: '',
      qty: '',
      status: ''
    }
  })

  // Handle Form Submit
  const handleFormSubmit = (data: FormValues) => {
    const newProduct: ProductType = {
      id: productData.length + 1,
      productName: data.productName,
      productBrand: data.productBrand,
      category: data.category,
      stock: stock,
      sku: Number(data.sku),
      price: data.price,
      qty: Number(data.qty),
      status: data.status,
      image: fileName
        ? `/images/apps/ecommerce/${fileName}`
        : `/images/apps/ecommerce/product-${Math.floor(Math.random() * 20) + 1}.png`
    }

    setData([...productData, newProduct])
    handleReset()
  }

  // Handle Form Reset
  const handleReset = () => {
    handleClose()
    resetForm({
      productName: '',
      productBrand: '',
      category: '',
      price: '',
      sku: '',
      qty: '',
      status: ''
    })
    setFileName('')
    setStock(true)
  }

  // Handle File Upload
  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target

    if (files && files.length !== 0) {
      setFileName(files[0].name)
    }
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <div className='flex items-center justify-between pli-5 plb-4'>
        <Typography variant='h5'>Add Product</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-5'>
        <form onSubmit={handleSubmit(data => handleFormSubmit(data))} className='flex flex-col gap-5'>
          <Controller
            name='productName'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Product Name'
                placeholder='iPhone 14 Pro'
                {...(errors.productName && { error: true, helperText: 'This field is required.' })}
              />
            )}
          />
          <Controller
            name='productBrand'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Product Brand'
                placeholder='Super Retina XDR display'
                {...(errors.productBrand && { error: true, helperText: 'This field is required.' })}
              />
            )}
          />
          <Controller
            name='category'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.category}>
                <InputLabel id='category-select'>Category</InputLabel>
                <Select
                  {...field}
                  fullWidth
                  id='category-select'
                  label='Category'
                  labelId='category-select'
                >
                  <MenuItem value='Accessories'>Accessories</MenuItem>
                  <MenuItem value='Home Decor'>Home Decor</MenuItem>
                  <MenuItem value='Electronics'>Electronics</MenuItem>
                  <MenuItem value='Shoes'>Shoes</MenuItem>
                  <MenuItem value='Office'>Office</MenuItem>
                  <MenuItem value='Games'>Games</MenuItem>
                </Select>
                {errors.category && (
                  <Typography variant='caption' color='error' sx={{ mt: 1, ml: 1.75 }}>
                    This field is required.
                  </Typography>
                )}
              </FormControl>
            )}
          />
          <div className='flex items-center gap-4'>
            <TextField
              size='small'
              placeholder='No file chosen'
              variant='outlined'
              value={fileName}
              className='flex-auto'
              slotProps={{
                input: {
                  readOnly: true,
                  endAdornment: fileName ? (
                    <InputAdornment position='end'>
                      <IconButton size='small' edge='end' onClick={() => setFileName('')}>
                        <i className='ri-close-line' />
                      </IconButton>
                    </InputAdornment>
                  ) : null
                }
              }}
            />
            <Button component='label' variant='outlined' htmlFor='contained-button-file' className='min-is-fit'>
              Choose
              <input hidden id='contained-button-file' type='file' onChange={handleFileUpload} ref={fileInputRef} />
            </Button>
          </div>
          <Controller
            name='price'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Price'
                placeholder='$999'
                {...(errors.price && { error: true, helperText: 'This field is required.' })}
              />
            )}
          />
          <Controller
            name='sku'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='SKU'
                placeholder='19472'
                type='number'
                {...(errors.sku && { error: true, helperText: 'This field is required.' })}
              />
            )}
          />
          <Controller
            name='qty'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Quantity'
                placeholder='665'
                type='number'
                {...(errors.qty && { error: true, helperText: 'This field is required.' })}
              />
            )}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', minHeight: '56px' }}>
            <FormControlLabel
              control={<Switch checked={stock} onChange={e => setStock(e.target.checked)} />}
              label='In Stock'
              sx={{
                marginLeft: 0,
                marginRight: 0,
                '& .MuiFormControlLabel-label': {
                  marginLeft: '8px'
                }
              }}
            />
          </Box>
          <Controller
            name='status'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.status}>
                <InputLabel id='status-select'>Status</InputLabel>
                <Select
                  {...field}
                  fullWidth
                  id='status-select'
                  label='Status'
                  labelId='status-select'
                >
                  <MenuItem value='Published'>Published</MenuItem>
                  <MenuItem value='Inactive'>Inactive</MenuItem>
                  <MenuItem value='Scheduled'>Scheduled</MenuItem>
                </Select>
                {errors.status && (
                  <Typography variant='caption' color='error' sx={{ mt: 1, ml: 1.75 }}>
                    This field is required.
                  </Typography>
                )}
              </FormControl>
            )}
          />
          <div className='flex items-center gap-4'>
            <Button variant='contained' type='submit'>
              Add
            </Button>
            <Button variant='outlined' color='error' type='reset' onClick={handleReset}>
              Discard
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default AddProductDrawer
