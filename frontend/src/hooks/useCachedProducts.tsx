import { useEffect, useState } from "react"
import { useCookies } from "react-cookie"
import { BasicProduct } from "../JSONTypes"

export function useCachedProducts(): [BasicProduct[], (val: BasicProduct[]) => void] {
  const encodeProducts = (products: BasicProduct[]): string => {
    let s = ''
    for (let product of products) {
      for (let key in product) {
        if (key === 'price' || key === 'sum') {
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
  
  const decodeProducts = (s: string): BasicProduct[] => {
    let products: BasicProduct[] = []
    if (s === undefined) {
      return products
    }
    const dummy = {EUR: 0, MDL: 0, RON: 0, USD: 0}
    for (let productDec of s.split('/').slice(0, -1)) {
      let productEnc: BasicProduct = {
        category: '',
        name: '',
        discount: 0,
        size: '',
        quantity: 0,
        price: {...dummy},
        sum: {...dummy}
      }
      for (let pair of productDec.split(';').slice(0, -1)) {
        let [key, value] = pair.split('=')
        if (key.startsWith('price') || key.startsWith('sum')) {
          productEnc[key.slice(0, -3) as 'price' | 'sum'][key.slice(-3)] = Number(value)
        } else if (key === 'discount' || key === 'quantity') {
          productEnc[key] = Number(value)
        } else if (key === 'category' || key === 'name' || key === 'size') {
          productEnc[key] = value
        }
      }
      
      products.push(productEnc)
    }
    
    return products
  }

  const [cookies, setCookie, removeCookie] = useCookies(['products'])
  const [products, setProducts] = useState<BasicProduct[]>(decodeProducts(cookies.products))

  useEffect(() => {
    const s = encodeProducts(products)
    if (s != cookies.products) {
      setCookie('products', s, {path: '/'})
    }
  }, [products])

  return [products, setProducts]
}
/*
category=Mattress;name=Favorit;discount=5;size=80 x 200;quantity=1;priceEUR=115;priceMDL=2358;priceRON=0;priceUSD=0;sumEUR=109.25;sumMDL=2240.1;sumRON=0;sumUSD=0;/
*/