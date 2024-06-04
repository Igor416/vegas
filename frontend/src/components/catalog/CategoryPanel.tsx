import { useEffect, useState } from "react"
import { Card } from "./Card"
import { ResponsiveProps, TranslatableProps } from "../.."
import { Category, ListProduct } from "../../JSONTypes"

interface SortedProducts {
  [key: string]: Array<ListProduct | null>
}

interface CategoryPanelProps extends ResponsiveProps, TranslatableProps {
  isSales: boolean
  rawProducts: ListProduct[],
  category: Category,
  setActive: (val: ListProduct) => void
}

export function CategoryPanel({isMobile, t, isSales, rawProducts, category, setActive}: CategoryPanelProps) {
  const [isGrid, toggleGrid] = useState(true)
  const [products, setProducts] = useState<SortedProducts>()

  useEffect(() => {
    if (rawProducts.length == 0) {
      return
    }
    if (category.name === 'sales') {
      let remainder = rawProducts.length % 3
      let sortedProducts: SortedProducts = {
        'sales': rawProducts
      }
      if (remainder != 0) {
        for (let i = 0; i < 3 - remainder; i++) {
          sortedProducts.sales.push(null)
        }
      }
      setProducts(sortedProducts)
      return
    }
    let sortedProducts: SortedProducts = {};
    let remainder;

    if (Array.isArray(rawProducts[0].default_filtering)) {
      for (let i = 0; i < rawProducts.length; i++) {
        for (let j = 0; j < (rawProducts.length - i - 1); j++) {
          if (rawProducts[j].default_filtering.length < rawProducts[j+1].default_filtering.length) {
            [rawProducts[j], rawProducts[j+1]] = [rawProducts[j + 1], rawProducts[j]]
          }
        }
      }
    }

    for (let product of rawProducts) {
      if (product.default_filtering in sortedProducts) {
        sortedProducts[product.default_filtering].push(product)
      }
      else {
        sortedProducts[product.default_filtering] = [product]
      }
    }
    
    for (let filtering in sortedProducts) {
      sortedProducts[filtering] = sortedProducts[filtering].sort((p1, p2) => p1 && p2 ? p1.name.localeCompare(p2.name) : -1)
      remainder = sortedProducts[filtering].length % 3
      if (remainder != 0) {
        for (let i = 0; i < 3 - remainder; i++) {
          sortedProducts[filtering].push(null)
        }
      }
    }
    setProducts(sortedProducts)
  }, [rawProducts])

  return <>
    <div className='d-flex flex-row justify-content-end align-items-center h6'>
      {!isMobile && <div onClick={() => toggleGrid(!isGrid)} className={(isGrid ? 'switch-grid' : 'switch-column') + ' switch d-flex transition'}>
        {[0, 1, 2].map((value) => <div key={value} className='bg-white transition' />)}
      </div>}
    </div>
    {products && Object.keys(products).map((filtering, i) => <div key={i} className='d-flex mb-5 flex-column'>
      <span className='h4'>{category.default_filtering_lang} {filtering}</span>
      <div className={(isGrid ? 'section-grid' : 'section-column') + ' d-flex flex-wrap mt-3 justify-content-between transition'}>
        {products[filtering].map((product, i) => 
        product === null
        ?
        <div key={i} />
        :
        <Card
          key={i}
          isMobile={isMobile}
          t={t}
          product={product}
          isSales={isSales}
          isGrid={isGrid}
          setActive={setActive}
        />
        )}
      </div>
    </div>)}
  </>
}