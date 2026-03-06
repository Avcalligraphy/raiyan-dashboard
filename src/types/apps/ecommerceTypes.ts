export type ProductType = {
  id: number
  productName: string
  category: string
  stock: boolean
  sku: number
  price: string
  qty: number
  status: string
  image: string
  productBrand: string
}

export type ECommerceType = {
  products: ProductType[]
}

export type categoryType = {
  id: number
  categoryTitle: string
  description: string
  totalProduct: number
  totalEarning: number
  image: string
}