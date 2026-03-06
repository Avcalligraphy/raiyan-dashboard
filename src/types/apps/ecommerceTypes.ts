import type { ThemeColor } from "@core/types";

export type ProductType = {
  id: number;
  productName: string;
  category: string;
  stock: boolean;
  sku: number;
  price: string;
  qty: number;
  status: string;
  image: string;
  productBrand: string;
};

export type ECommerceType = {
  products: ProductType[];
};

export type categoryType = {
  id: number;
  categoryTitle: string;
  description: string;
  totalProduct: number;
  totalEarning: number;
  image: string;
};

export type UserManagementType = {
  id: number;
  customer: string;
  customerId: string;
  email: string;
  country: string;
  countryCode: string;
  countryFlag?: string;
  order: number;
  totalSpent: number;
  avatar: string;
  status?: string;
  contact?: string;
};

export type UsersType = {
  id: number;
  role: string;
  email: string;
  status: string;
  avatar: string;
  company: string;
  country: string;
  contact: string;
  fullName: string;
  username: string;
  currentPlan: string;
  avatarColor?: ThemeColor;
};

export type TestimonialsType = {
  id: number;
  product: string;
  companyName: string;
  productImage: string;
  reviewer: string;
  email: string;
  avatar: string;
  date: string;
  status: string;
  review: number;
  head: string;
  para: string;
};
