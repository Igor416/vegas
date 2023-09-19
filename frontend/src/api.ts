import Cookies from 'js-cookie'
import { Banner, BestProducts, DetailedProduct, Help, MattressColectionPrice, Order, ListProduct, Review, Sales, Search, SearchResults, Stock, ProductHelp, Category } from './JSONTypes'
import { func } from 'prop-types'

export function getBanners(): Promise<Banner[]> {
  const url = '/news/banners/'

  return sendGetRequest<Banner[]>(url)
}

export function getReviews(): Promise<Review[]> {
  const url = '/news/reviews/'

  return sendGetRequest<Review[]>(url)
}

export function sendReview(review: Review): Promise<Review> {
  const url = '/news/reviews/'

  return sendPostRequest<Review, Review>(url, review)
}

export function sendSearch(search: string): Promise<SearchResults> {
  const url = '/api/search/'
  
  return sendPostRequest<Search, SearchResults>(url, {search: search})
}

export function getBestProducts(): Promise<BestProducts> {
  const url = '/api/best/'

  return sendGetRequest<BestProducts>(url)
}

export function getStock(): Promise<Stock[]> {
  const url = '/api/stock/'

  return sendGetRequest<Stock[]>(url)
}

export function getMattressColectionsPrice(): Promise<MattressColectionPrice[]> {
  const url = '/api/mattress_category_prices/'

  return sendGetRequest<MattressColectionPrice[]>(url)
}

export function getCategories(): Promise<Category[]> {
  const url = 'api/categories/'

  return sendGetRequest<Category[]>(url)
}

export function getProducts(name: string, sub_category: string, filter: string | null = null): Promise<ListProduct[]> {
  const url = `/api/products/${name}/${sub_category}/` + (filter ? filter + '/' : '')

  return sendGetRequest<ListProduct[]>(url);
}

export function getSales(): Promise<Sales> {
  const url = '/api/sales/'

  return sendGetRequest<Sales>(url)
}

export function getProduct(category: string, name: string): Promise<DetailedProduct> {
  const url = `/api/product/${category}/${name}/`

  return sendGetRequest<DetailedProduct>(url);
}

export function sendOrder(data: Order): Promise<Order> | string {
  for (let key in data) {
    if (data[key as keyof Order] == '') {
      return 'error: empty'
    }
  }
  const url = '/telegram/order/'

  return sendPostRequest<Order, Order>(url, data)
}

export function sendProductHelp(data: ProductHelp): Promise<ProductHelp> | string {
  for (let key in data) {
    if (data[key as keyof Help] == '' || data[key as keyof Help] == undefined) {
      return 'error: empty'
    }
  }
  const url = '/telegram/order_call/'

  return sendPostRequest<ProductHelp, ProductHelp>(url, data)
}

export function sendHelp(data: Help): Promise<Help> | string {
  for (let key in data) {
    if (data[key as keyof Help] == '' || data[key as keyof Help] == undefined) {
      return 'error: empty'
    }
  }
  const url = '/telegram/order_call/'

  return sendPostRequest<Help, Help>(url, data)
}

async function sendPostRequest<T, R>(url: string, body: T): Promise<R> {
  const options = {
    method: 'POST',
    headers: {
      'X-CSRFToken': Cookies.get('csrftoken') as string,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }
  const response = await fetch(url + '?lang=' + Cookies.get('lang'), options);
  const data = await response.json();
  return data;
}

async function sendGetRequest<T>(url: string): Promise<T> {
  const response = await fetch(url + '?lang=' + Cookies.get('lang'));
  const data = await response.json();
  return data;
}