import { Banner, BestProducts, Category, DetailedProduct, Help, MattressColectionPrice, Order, Product, Review, Sales, Search, SearchResults, Stock } from "./JSONTypes"

export function getBanners(): Promise<Banner[]> {
  let url = '/news/'

  return sendGetRequest<Banner[]>(url)
}

export function getReviews(): Promise<Review[]> {
  let url = '/news/reviews/'

  return sendGetRequest<Review[]>(url)
}

export function sendReview(review: Review, csrftoken: string): Promise<Review> {
  let url = '/news/reviews/'

  return sendPostRequest<Review, Review>(url, review, csrftoken)
}

export function sendSearch(search: string, csrftoken: string): Promise<SearchResults> {
  let url = '/api/search/'
  
  return sendPostRequest<Search, SearchResults>(url, {search: search}, csrftoken)
}

export function getBestProducts(): Promise<BestProducts> {
  let url = '/api/best/'

  return sendGetRequest<BestProducts>(url)
}

export function getStock(): Promise<Stock[]> {
  let url = '/api/stock/'

  return sendGetRequest<Stock[]>(url)
}

export function getMattressColectionsPrice(): Promise<MattressColectionPrice[]> {
  let url = '/api/mattress_category_prices/'

  return sendGetRequest<MattressColectionPrice[]>(url)
}

export function getCategory(name: string): Promise<Category> {
  let url = `/api/category/${name}/`

  return sendGetRequest<Category>(url);
}

export function getProducts(name: string, sub_category: string, filter: string | null = null): Promise<Product[]> {
  let url = `/api/products/${name}/${sub_category}/`
  
  if (filter) {
    url += filter + '/'
  }

  return sendGetRequest<Product[]>(url);
}

export function getSales(): Promise<Sales> {
  let url = '/api/sales/'

  return sendGetRequest<Sales>(url)
}

export function getProduct(name: string, id: number): Promise<DetailedProduct> {
  let url = `/api/product/${name}/${id}/`

  return sendGetRequest<DetailedProduct>(url);
}

export function sendOrder(data: Order, csrftoken: string): Promise<Order> | string {
  for (let key in data) {
    if (data[key as keyof Order] == '') {
      return 'error: empty'
    }
  }
  let url = '/telegram/order/'

  return sendPostRequest<Order, Order>(url, data, csrftoken, '')
}

export function sendHelp(data: Help, csrftoken: string): Promise<Help> | string {
  let url = '/telegram/order_call/'
  for (let key in data) {
    if (data[key as keyof Help] == '' || data[key as keyof Help] == undefined) {
      return 'error: empty'
    }
  }

  return sendPostRequest<Help, Help>(url, data, csrftoken, '')
}

async function sendPostRequest<T, R>(url: string, body: T, csrftoken: string, postfix=location.search): Promise<R> {
  const options = {
    method: "POST",
    headers: {
      'X-CSRFToken': csrftoken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }
  const response = await fetch(url + postfix, options);
  const data = await response.json();
  return data;
}

async function sendGetRequest<T>(url: string, postfix=location.search): Promise<T> {
  const response = await fetch(url + postfix);
  const data = await response.json();
  return data;
}