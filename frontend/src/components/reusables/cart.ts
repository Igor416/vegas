import Cookies from "js-cookie";

import { BasicProduct, DetailedProduct, Price, Size } from "./JSONTypes"

export default class Cart {
  products: BasicProduct[] = [];
  currency: keyof Price = 'EUR';
  country: string;
  total: number = 0;

  constructor() {
    this.country = Cookies.get('country') as string;
    this.products = this.decodeProducts(Cookies.get('products') as string)
    this.calcTotal()
  }

  calcTotal() {
    let sum = 0
    for (let product of this.products) {
      sum += product.sum[this.currency]
    }
    this.total = sum;
  }

  getCurrencies(): Array<keyof Price> {
    const currencies = {
      'MD': ['MDL', 'EUR'],
      'RO': ['RON', 'EUR'],
      'US': ['USD', 'EUR']
    }

    if (this.country == 'RO' || this.country == 'US') {
      return currencies[this.country]
    }

    return currencies.MD
  }

  updateCurrency(currency: keyof Price) {
    this.currency = currency
    this.calcTotal()
  }

  addProduct(category: string, product: DetailedProduct, size: Size, quantity: number) {
    let contains, pr
    for (pr of this.products) {
      if (pr.id == product.id && pr.category == category && pr.size == size.width + ' x ' + size.length) {
        contains = true
        break
      }
    }
    if (contains) {
      this.updateQuantity(category, product.id, (pr as BasicProduct).quantity + quantity)
      return
    }

    let newProduct: BasicProduct = {
      category: category,
      name: product.name,
      id: product.id,
      discount: product.discount,
      size: size.width + ' x ' + size.length,
      quantity: quantity,
      price: {
        EUR: 0,
        MDL: 0,
        RON: 0,
        USD: 0,
      },
      sum: {
        EUR: 0,
        MDL: 0,
        RON: 0,
        USD: 0,
      }
    }

    for (let currency of this.getCurrencies()) {
      newProduct.price[currency] = size.price[currency];
      newProduct.sum[currency] = this.applyDiscount(size.price[currency], product.discount) * quantity
    }

    this.products.push(newProduct)
    this.calcTotal()
    Cookies.set('products', this.encodeProducts(this.products))
  }

  deleteProduct(category: string, id: number, size: string) {
    this.products = this.products.filter(pr => !(pr.id == id && pr.category == category && pr.size == size))
    this.calcTotal()
    Cookies.set('products', this.encodeProducts(this.products))
  }

  updateQuantity(category: string, id: number, quantity: number) {
    const product = this.products.filter(pr => pr.category == category && pr.id == id)[0]
    for (let currency of this.getCurrencies()) {
      product.sum[currency] = +(product.sum[currency] * quantity / product.quantity).toFixed(2)
    }
    product.quantity = quantity
    this.products[this.products.indexOf(product)] = product
    this.calcTotal()
    Cookies.set('products', this.encodeProducts(this.products))
  }

  private applyDiscount(value: number, discount: number): number {
    return value * (100 - discount) / 100
  }

  private encodeProducts(products: BasicProduct[]): string {
    let s = ''
    for (let product of products) {
      for (let key in product) {
        if (key == 'price' || key == 'sum') {
          for (let currency in product[key]) {
            s += `${key + currency}=${product[key][currency]};`
          }
        } else {
          s += `${key}=${product[key as keyof BasicProduct]};`
        }
      }
      s += '/'
    }
    
    return s
  }

  private decodeProducts(s: string): BasicProduct[] {
    let products: BasicProduct[] = []
    if (s == undefined) {
      return products
    }

    for (let productDec of s.split('/').slice(0, -1)) {
      let productEnc: BasicProduct = {
        category: '',
        name: '',
        id: 0,
        discount: 0,
        size: '',
        quantity: 0,
        price: {
          EUR: 0,
          MDL: 0,
          RON: 0,
          USD: 0,
        },
        sum: {
          EUR: 0,
          MDL: 0,
          RON: 0,
          USD: 0,
        }
      }
      for (let pair of productDec.split(';')) {
        if (pair != '') {
          let key = pair.split('=')[0]
          let value: string | number = pair.split('=')[1]
          if (key.includes('price')) {
            productEnc.price[key.slice(-3)] = Number(value)
          } else if (key.includes('sum')) {
            productEnc.sum[key.slice(-3)] = Number(value)
          } else if (key == 'id' || key == 'discount' || key == 'quantity') {
            productEnc[key] = Number(value)
          } else if (key == 'category' || key == 'name' || key == 'size') {
            productEnc[key] = value
          }
        }
      }
      
      products.push(productEnc)
    }
    
    return products
  }
}
