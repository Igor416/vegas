export interface Banner {
  banner: string,
}

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

interface BestProduct {
  id: 39,
  shortcut: string,
  name: string,
  discount: number,
  category: string,
  size: Size,
  category_name: string
}

export interface BestProducts {
  "MATTRESSES": BestProduct[],
  "PILLOWS": BestProduct[],
  "FOR KIDS": BestProduct[],
  "BASISES": BestProduct[],
  "FURNITURE": BestProduct[]
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
  default_filtering: string,
  default_filtering_lang: string
}

export interface BasicProduct {
  category: string,
  name: string,
  id: number,
  discount: number,
  size: string,
  quantity: number,
  price: Price,
  sum: Price
}

export interface Product {
  id: number,
  category: string,
  name: string,
  discount: number,
  best: boolean,
  desc: string,
  shortcut: string,
  default_filtering: string,
  markers: string[],
  size: Size
}

export interface Sales {
  products: Product[],
  name_s: string,
  name_pl: string
}

export interface DetailedProduct {
  id: number,
  name: string,
  discount: number,
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

export interface OrderedProduct {
  id: number,
  name: string,
  category: Category,
  discount: number,
  shortcut: string,
  quantity: number,
  size: Size,
  sum: Price
}

export interface Order {
  products: BasicProduct[],
  total: string,
  name: string,
  town: string,
  address: string,
  phone: string,
  payment: string,
  courier: string
}

export interface Help {
  category?: string,
  product?: string,
  name: string,
  phone: string
}