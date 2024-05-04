import { useContext, useEffect, useState } from "react"

import { BedSheetsSize, DetailedProduct } from "../../JSONTypes"
import { CustomButton } from "../reusables"
import { TranslatableProps } from "../.."
import { PricePanel } from "./PricePanel"
import { BedSheetsSizesManager } from "./BedSheetsSizesManager"
import { BedSizesManager } from "./BedSizesManager"
import { SizesManager } from "./SizesManager"
import { CartDispatchContext } from "../../providers"
import { useCurrencies } from "../../hooks"

interface SizesPanelProps extends TranslatableProps {
  product: DetailedProduct
}

export function SizesPanel({t, product}: SizesPanelProps) {
  const [active, setActive] = useState(-1)
  const [quantity, setQuantity] = useState(1)
  const currencies = useCurrencies()
  const dispatch = useContext(CartDispatchContext)

  useEffect(() => {
    setActive(0)
  }, [product])

  return <div className='d-flex flex-column w-100'>
    <PricePanel
      t={t}
      discount={product.discount}
      size={product.sizes[active]}
    />
    {product['markers'] && active > -1 &&
      <div style={{height: '6vh'}} className='d-flex row-nowrap justify-content-start my-3'>
        {product.markers.map((marker, i) => {
          return <img className='me-2' key={i} src={marker} style={{width: '6vh', height: '6vh'}}/>
        })}
        {product.sizes[active].on_sale &&
          <img style={{width: '6vh', height: '6vh'}} src='/static/images/sale.jpg'/>
        }
      </div>
    }
    <div className='d-flex border flex-column mt-sm-5 p-3'>
      {product.category.name === 'BedSheets'
      ?
        <BedSheetsSizesManager
          sizes={product.sizes.map(size => size as BedSheetsSize)}
          active={active}
          setActive={setActive}
        />
      :
      (product.category.name === 'Bed'
      ?
        <BedSizesManager
          extra_width={product['extra_width'] as number}
          extra_length={product['extra_length'] as number}
          sizes={product.sizes}
          active={active}
          setActive={setActive}
        />
      :
        <SizesManager
          sizes={product.sizes}
          active={active}
          setActive={setActive}
        />
      )}
      <div className='d-flex justify-content-between align-items-stretch pt-3'>
        <div style={{border: '1px solid var(--lime-green)'}} className='d-flex flex-row justify-content-between align-items-center p-3 h5'>
          <div onClick={() => setQuantity(quantity == 1 ? quantity : quantity - 1)}>
            <span>-</span>
          </div>
          <div style={{width: '2rem'}} className='d-flex justify-content-center'>
            <span>{quantity}</span>
          </div>
          <div onClick={() => setQuantity(quantity == 99 ? quantity : quantity + 1)}>
            <span>+</span>
          </div>
        </div>
        <div className='ps-5' onClick={() => dispatch({
          type: 'added',
          category: product.category.name,
          product: product,
          size: product.sizes[active],
          currencies: currencies,
          quantity: quantity
        })}>
          <CustomButton color='deep-sky-blue' text={t('buy')} />
        </div>
      </div>
    </div>
  </div>
}