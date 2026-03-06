// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import ProductListTable from './ProductListTable'
import ProductCard from './ProductCard'

// Data Imports
import { getEcommerceData } from '@/data/apps/ecommerce'

const ListPackagesPage = () => {
  // Vars
  const data = getEcommerceData()

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <ProductCard />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <ProductListTable productData={data?.products} />
      </Grid>
    </Grid>
  )
}

export default ListPackagesPage

