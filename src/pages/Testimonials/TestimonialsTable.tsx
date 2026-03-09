'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import Rating from '@mui/material/Rating'
import Select from '@mui/material/Select'
import TablePagination from '@mui/material/TablePagination'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import type { TextFieldProps } from '@mui/material/TextField'

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

// Component Imports
import OptionMenu from '@core/components/option-menu'
import { PermissionTooltip } from '@/components/PermissionTooltip'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import type { Testimonial } from '@/types/testimonialTypes'
import { testimonialService } from '@/services/testimonialService'
import AddTestimonialDrawer from './AddTestimonialDrawer'

declare module '@tanstack/react-table' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type RowType = Testimonial & { actions?: string }

const fuzzyFilter: FilterFn<RowType> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
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

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => onChange(value), debounce)
    return () => clearTimeout(timeout)
  }, [value, debounce, onChange])

  return <TextField {...props} value={value} onChange={e => setValue(e.target.value)} size='small' />
}

const columnHelper = createColumnHelper<RowType>()

function truncate(str: string, max: number) {
  if (!str) return ''
  return str.length <= max ? str : str.slice(0, max) + '…'
}

const TestimonialsTable = ({
  data: testimonials = [],
  loading = false,
  onRefetch
}: {
  data?: Testimonial[]
  loading?: boolean
  onRefetch?: () => void
}) => {
  const [publishFilter, setPublishFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [globalFilter, setGlobalFilter] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)

  const filteredData = useMemo(() => {
    let list = testimonials ?? []
    if (publishFilter === 'published') list = list.filter(t => t.is_published)
    if (publishFilter === 'draft') list = list.filter(t => !t.is_published)
    return list
  }, [testimonials, publishFilter])

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: ({ row }) => (
          <Typography className='font-medium' color='text.primary'>
            {row.original.name}
          </Typography>
        )
      }),
      columnHelper.accessor('city', {
        header: 'City',
        cell: ({ row }) => <Typography variant='body2'>{row.original.city}</Typography>
      }),
      columnHelper.accessor('media_type', {
        header: 'Type',
        cell: ({ row }) => (
          <Chip label={row.original.media_type} variant='tonal' size='small' />
        )
      }),
      columnHelper.accessor('content', {
        header: 'Content',
        cell: ({ row }) => (
          <Typography variant='body2' className='text-wrap max-w-[200px]'>
            {truncate(row.original.content ?? '', 80)}
          </Typography>
        )
      }),
      columnHelper.accessor('rating', {
        header: 'Rating',
        sortingFn: (rowA, rowB) => rowA.original.rating - rowB.original.rating,
        cell: ({ row }) => (
          <Rating
            name='rating'
            readOnly
            value={row.original.rating}
            size='small'
            emptyIcon={<i className='ri-star-fill' />}
          />
        )
      }),
      columnHelper.accessor('is_published', {
        header: 'Status',
        cell: ({ row }) => (
          <Chip
            label={row.original.is_published ? 'Published' : 'Draft'}
            variant='tonal'
            color={row.original.is_published ? 'success' : 'default'}
            size='small'
          />
        )
      }),
      columnHelper.accessor(row => row.created_at ?? '', {
        id: 'created_at',
        header: 'Date',
        sortingFn: (rowA, rowB) => {
          const a = new Date(rowA.original.created_at ?? 0).getTime()
          const b = new Date(rowB.original.created_at ?? 0).getTime()
          return a - b
        },
        cell: ({ row }) => {
          const raw = row.original.created_at
          if (!raw) return <Typography variant='body2'>—</Typography>
          const date = new Date(raw).toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
          })
          return <Typography variant='body2'>{date}</Typography>
        }
      }),
      columnHelper.accessor('actions', {
        header: 'Actions',
        cell: ({ row }) => {
          const t = row.original
          return (
            <OptionMenu
              iconButtonProps={{ size: 'medium' }}
              iconClassName='text-textSecondary text-[22px]'
              options={[
                {
                  text: 'Edit',
                  icon: 'ri-pencil-line',
                  menuItemProps: {
                    onClick: () => {
                      setEditingTestimonial(t)
                      setDrawerOpen(true)
                    },
                    className: 'flex items-center pli-4'
                  }
                },
                {
                  text: t.is_published ? 'Unpublish' : 'Publish',
                  icon: t.is_published ? 'ri-eye-off-line' : 'ri-eye-line',
                  menuItemProps: {
                    onClick: async () => {
                      try {
                        await testimonialService.publish(t.id, !t.is_published)
                        onRefetch?.()
                      } catch (err) {
                        console.error(err)
                      }
                    },
                    className: 'flex items-center pli-4'
                  }
                },
                {
                  text: 'Delete',
                  icon: 'ri-delete-bin-7-line',
                  menuItemProps: {
                    onClick: async () => {
                      if (!window.confirm('Delete this testimonial?')) return
                      try {
                        await testimonialService.delete(t.id)
                        onRefetch?.()
                      } catch (err) {
                        console.error(err)
                      }
                    },
                    className: 'flex items-center pli-4'
                  }
                }
              ]}
            />
          )
        },
        enableSorting: false
      })
    ] as ColumnDef<RowType>[],
    [onRefetch]
  )

  const table = useReactTable({
    data: filteredData as RowType[],
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { globalFilter },
    initialState: { pagination: { pageSize: 10 } },
    globalFilterFn: fuzzyFilter,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  const handleAddNew = () => {
    setEditingTestimonial(null)
    setDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
    setEditingTestimonial(null)
  }

  return (
    <>
      <Card>
        <div className='flex justify-between flex-col items-start flex-wrap sm:flex-row sm:items-center gap-4 p-5'>
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            placeholder='Search testimonials'
            className='max-sm:is-full'
          />
          <div className='flex flex-col sm:flex-row items-center gap-4 max-sm:is-full'>
            <FormControl fullWidth size='small' className='sm:is-[140px] flex-auto is-full'>
              <Select
                fullWidth
                id='select-status'
                value={publishFilter}
                onChange={e => setPublishFilter(e.target.value as 'all' | 'published' | 'draft')}
                labelId='status-select'
              >
                <MenuItem value='all'>All</MenuItem>
                <MenuItem value='published'>Published</MenuItem>
                <MenuItem value='draft'>Draft</MenuItem>
              </Select>
            </FormControl>
            <PermissionTooltip permission='testimonials.write'>
              <Button
                variant='contained'
                color='primary'
                fullWidth={false}
                sx={{ width: { xs: '100%', sm: 'auto' } }}
                startIcon={<i className='ri-add-line' />}
                onClick={handleAddNew}
                disabled={loading}
              >
                Add Testimonial
              </Button>
            </PermissionTooltip>
          </div>
        </div>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div
                          className={classnames({
                            'flex items-center': header.column.getIsSorted(),
                            'cursor-pointer select-none': header.column.getCanSort()
                          })}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: <i className='ri-arrow-up-s-line text-xl' />,
                            desc: <i className='ri-arrow-down-s-line text-xl' />
                          }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    Loading…
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    No testimonials
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component='div'
          className='border-bs'
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => table.setPageIndex(page)}
          onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
        />
      </Card>
      <AddTestimonialDrawer
        open={drawerOpen}
        handleClose={handleCloseDrawer}
        testimonial={editingTestimonial}
        onSuccess={onRefetch}
      />
    </>
  )
}

export default TestimonialsTable
