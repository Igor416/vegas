import { Dispatch, ProviderProps, createContext, useEffect, useReducer } from "react";
import { DetailedProduct, BasicProduct, Size, Price } from "../JSONTypes";
import { useCachedProducts } from "../hooks/useCachedProducts";

type cartAction = {
  type: 'created',
  products: BasicProduct[]
} | {
  type: 'added',
  category: string,
  product: DetailedProduct,
  size: Size,
  currencies: Array<keyof Price>,
  quantity: number
} | {
  type: 'deleted',
  category: string,
  name: string,
  size: Size
} | {
  type: 'updated',
  category: string,
  name: string,
  size: Size,
  currencies: Array<keyof Price>,
  quantity: number
}

export const CartContext = createContext<BasicProduct[]>([]);
export const CartDispatchContext = createContext<Dispatch<cartAction>>({} as Dispatch<cartAction>);

function CartReducer(products: BasicProduct[], action: cartAction) {
  switch (action.type) {
    case 'created': {
      return action.products
    }
    case 'added': {
      const pr = products.find(pr => 
        pr.name === action.product.name
        &&
        pr.category === action.category
        &&
        pr.size === action.size.width + ' x ' + action.size.length
      );
      if (pr) {
        return CartReducer(products, {
          type: 'updated',
          category: action.category,
          name: action.product.name,
          size: action.size,
          currencies: action.currencies,
          quantity: pr.quantity + action.quantity
        })
      }
      const dummy = {EUR: 0, MDL: 0, RON: 0, USD: 0}
      let newProduct: BasicProduct = {
        category: action.category,
        name: action.product.name,
        discount: action.product.discount,
        size: action.size.width + ' x ' + action.size.length,
        quantity: action.quantity,
        price: {...dummy},
        sum: {...dummy}
      }

      for (let currency of action.currencies) {
        newProduct.price[currency] = action.size.price[currency];
        newProduct.sum[currency] = action.size.price[currency] * action.quantity * (100 - action.product.discount) / 100
      }
      return [...products, newProduct]
    }
    case 'deleted': {
      return products.filter(pr => !(
        pr.name === action.name
        &&
        pr.category === action.category
        &&
        pr.size === action.size.width + ' x ' + action.size.length
      ))
    }
    case 'updated': {
      return products.map(pr => {
        if (pr.name === action.name && pr.category === action.category && pr.size === action.size.width + ' x ' + action.size.length) {
          for (let currency of action.currencies) {
            pr.sum[currency] = +(pr.sum[currency] * action.quantity / pr.quantity).toFixed(2)
          }
          pr.quantity = action.quantity
          return pr
        }
        return pr
      })
    }
  }
}

export function CartProvider({children, value}: ProviderProps<BasicProduct[]>) {
  const [cachedProducts, setCachedProducts] = useCachedProducts()
  const [products, dispatch] = useReducer(CartReducer, value)

  useEffect(() => {
    dispatch({type: 'created', products: cachedProducts})
  }, [])
  
  useEffect(() => {
    setCachedProducts(products)
  }, [products])

  return <CartContext.Provider value={products}>
    <CartDispatchContext.Provider value={dispatch}>
      {children}
    </CartDispatchContext.Provider>
  </CartContext.Provider>
}
/*
category=Pillow;name=20;discount=0;size=60 x 40;quantity=1;priceEUR=101;priceMDL=2070;priceRON=0;priceUSD=0;sumEUR=1616;sumMDL=33120;sumRON=0;sumUSD=0;/
*/