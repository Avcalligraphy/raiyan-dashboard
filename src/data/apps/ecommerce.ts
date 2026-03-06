// Type Imports
import type { ECommerceType } from '@/types/apps/ecommerceTypes'

export const getEcommerceData = (): ECommerceType => {
  return {
    products: [
      {
        id: 1,
        productName: 'iPhone 14 Pro',
        category: 'Electronics',
        stock: true,
        sku: 19472,
        price: '$999',
        qty: 665,
        status: 'Inactive',
        image: '/images/apps/ecommerce/product-1.png',
        productBrand: 'Super Retina XDR display footnote Pro Motion technology'
      },
      {
        id: 2,
        productName: 'Echo Dot (4th Gen)',
        category: 'Electronics',
        stock: false,
        sku: 72836,
        price: '$25.50',
        qty: 827,
        status: 'Published',
        image: '/images/apps/ecommerce/product-2.png',
        productBrand: 'Echo Dot Smart speaker with Alexa'
      },
      {
        id: 3,
        productName: 'Dohioue Wall Clock',
        category: 'Accessories',
        stock: false,
        sku: 29540,
        price: '$16.34',
        qty: 804,
        status: 'Published',
        image: '/images/apps/ecommerce/product-3.png',
        productBrand: 'Modern 10 Inch Battery Operated Wall Clocks'
      },
      {
        id: 4,
        productName: 'INZCOU Running Shoes',
        category: 'Shoes',
        stock: false,
        sku: 49402,
        price: '$36.98',
        qty: 528,
        status: 'Scheduled',
        image: '/images/apps/ecommerce/product-4.png',
        productBrand: 'Lightweight Tennis Shoes Non Slip Gym Workout Shoes'
      },
      {
        id: 5,
        productName: 'Apple Watch Series 7',
        category: 'Office',
        stock: false,
        sku: 46658,
        price: '$799',
        qty: 851,
        status: 'Scheduled',
        image: '/images/apps/ecommerce/product-5.png',
        productBrand: 'Starlight Aluminum Case with Starlight Sport Band.'
      },
      {
        id: 6,
        productName: 'Meta Quest 2',
        category: 'Office',
        stock: true,
        sku: 57640,
        price: '$299',
        qty: 962,
        status: 'Scheduled',
        image: '/images/apps/ecommerce/product-6.png',
        productBrand: 'Advanced All-In-One Virtual Reality Headset'
      },
      {
        id: 7,
        productName: 'MacBook Pro 16',
        category: 'Electronics',
        stock: true,
        sku: 92885,
        price: '$2648.95',
        qty: 965,
        status: 'Published',
        image: '/images/apps/ecommerce/product-7.png',
        productBrand: 'Laptop M2 Pro chip with 12‑core CPU and 19‑core GPU'
      },
      {
        id: 8,
        productName: 'SAMSUNG Galaxy S22 Ultra',
        category: 'Electronics',
        stock: true,
        sku: 75257,
        price: '$899',
        qty: 447,
        status: 'Published',
        image: '/images/apps/ecommerce/product-8.png',
        productBrand: 'Android Smartphone, 256GB, 8K Camera'
      },
      {
        id: 9,
        productName: 'Home Decor Set',
        category: 'Home Decor',
        stock: true,
        sku: 12345,
        price: '$149.99',
        qty: 320,
        status: 'Published',
        image: '/images/apps/ecommerce/product-9.png',
        productBrand: 'Modern home decoration set'
      },
      {
        id: 10,
        productName: 'Gaming Console',
        category: 'Games',
        stock: false,
        sku: 67890,
        price: '$499',
        qty: 150,
        status: 'Scheduled',
        image: '/images/apps/ecommerce/product-10.png',
        productBrand: 'Next-gen gaming console'
      }
    ]
  }
}

