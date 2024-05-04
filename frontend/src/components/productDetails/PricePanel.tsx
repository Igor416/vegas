import { useContext } from "react"
import { TranslatableProps } from "../.."
import { Size } from "../../JSONTypes"
import { useCurrencies } from "../../hooks"
import { CurrencyContext, CurrencyDispatchContext } from "../../providers"
import { Hoverable } from "../reusables"

interface PriceProps extends TranslatableProps {
  discount: number,
  size: Size
}

export function PricePanel({t, discount, size}: PriceProps) {
  const currency = useContext(CurrencyContext)
  const dispatch = useContext(CurrencyDispatchContext)
  const currencies = useCurrencies()

  return <div className='d-flex border bg-light justify-content-center row-nowrap pt-2 mt-5 mt-sm-0 mb-sm-5'>
    <div className='border-end p-3 text-end'>
      {(size && (discount != 0 || size?.discount != 0)) && 
      <div style={{textDecoration: 'line-through'}}>
        <span>
          {`${t('old_price')}: ${size?.price[currency]} (${currency})`}
        </span>
      </div>
      }
      <div>
        <span>
          {`${t('current_price')}: `}
        </span>
        {size && <span style={{color: 'var(--lime-green)'}} className='h5'>
          {discount === 0
          ?
          (size.discount === 0
          ?
          size.price[currency]
          :
          (size.price[currency] * (100 - size.discount) / 100).toFixed(2)
          )
          :
          (size.discount > discount
          ?
          (size.price[currency] * (100 - size.discount) / 100).toFixed(2)
          :
          (size.price[currency] * (100 - discount) / 100).toFixed(2)
          )
          }
        </span>}
        <span>
          {` (${currency})`}
        </span>
      </div>
    </div>
    <div className='d-flex flex-column p-3'>
    {currencies.map((currency, i) => <div
      onClick={() => dispatch({type: 'updated', currency: currency})}
      className={'d-flex flex-row ' + (currency != currency && 'link')}
      key={i}
    >
      <Hoverable text={currency as string}/>
      <span>&nbsp;</span>
    </div>
    )}
    </div>
  </div>
}