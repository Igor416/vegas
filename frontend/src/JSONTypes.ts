export interface Review {
  title: string,
  date: string,
  city: string,
  text: string,
}

export interface Search {
  search: string,
}

export interface Price {
  EUR: number,
  MDL: number,
  RON: number,
  USD: number,
  [key: string]: number
}

export interface SearchResults {
  categories: Array<{
    link: string,
    text: string,
    count: string
  }>,
  products: Array<{
    link: string,
    text: string,
    price: Price,
    discount: number
  }>
}

export interface Size {
  width: number,
  length: number,
  price: Price,
  discount: number,
  on_sale: boolean,
}

export interface BedSheetsSize extends Size {
  duvet_cover_size: Size,
  sheet_size: Size,
  elasticated_sheet_size: Size,
  pillowcase_sizes: Size[],
}

export interface BestProducts {
  'MATTRESSES': BestProduct[],
  'PILLOWS': BestProduct[],
  'FOR KIDS': BestProduct[],
  'BASISES': BestProduct[],
  'FURNITURE': BestProduct[]
}

export interface Stock {
  discount: number,
  expiry: string,
  desc: string,
  collections: string[]
}

export interface MattressColectionPrice {
  [key: string]: {
    price: Price
  }
}

export interface Category {
  name: string,
  name_s: string,
  name_pl: string,
  desc: string,
  default_filtering: string,
  default_filtering_lang: string
}

interface Product {
  name: string,
  discount: number,
}

interface BestProduct extends Product {
  shortcut: string,
  category: Category,
  size: Size,
  category_name: string
}

export interface BasicProduct extends Product {
  category: string,
  size: string,
  quantity: number,
  price: Price,
  sum: Price
}

export interface ListProduct extends Product {
  category: Category,
  best: boolean,
  desc: string,
  shortcut: string,
  default_filtering: string,
  markers: string[],
  size: Size
}

export interface Sales {
  products: ListProduct[],
  name_s: string,
  name_pl: string
}

export interface DetailedProduct extends Product {
  category: Category,
  best: boolean,
  desc: string,
  shortcut: string,
  sizes: Size[],
  images: string[],
  videos: string[],
  structure: Array<{
      isTechnology: boolean,
      image: string,
      name: string,
      desc: string
  }>,
  technologies: Array<{
    image: string,
    name: string,
    desc: string
  }>,
  characteristic:  {
    [key: string]: string | string[] | number | boolean
  },
  description: {
    [key: string]: string | string[] | number | boolean
  }
  markers?: string[],
  extra_length?: number,
  extra_width?: number
}

export interface OrderedProduct extends Product {
  category: Category,
  shortcut: string,
  quantity: number,
  size: Size,
  sum: Price
}

export interface Order {
  products: OrderedProduct[],
  total: string,
  name: string,
  town: string,
  address: string,
  phone: string,
  payment: string,
  courier: string
}

export interface Help {
  name: string,
  phone: string
}

export interface ProductHelp extends Help {
  category: string,
  product: string
}