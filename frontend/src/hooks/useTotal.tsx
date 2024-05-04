import { useEffect, useState } from "react";
import { BasicProduct, OrderedProduct, Price } from "../JSONTypes";

export function useTotal(products: Array<BasicProduct | OrderedProduct>, currency: keyof Price) {
  const [total, setTotal] = useState(0)

  useEffect(() => {
    setTotal(products.reduce((a, b) => a + b.sum[currency], 0))
  }, [products, currency])

  return total
}