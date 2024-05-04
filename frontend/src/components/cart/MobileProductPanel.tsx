import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { OrderedProduct } from "../../JSONTypes"
import { TranslatableProps } from "../.."
import { CartDispatchContext, CurrencyContext } from "../../providers"
import { useContext } from "react"
import { useCurrencies } from "../../hooks"

interface MobileProductPanelProps extends TranslatableProps {
  pr: OrderedProduct
}

export function MobileProductPanel({t, pr}: MobileProductPanelProps) {
  const currencies = useCurrencies()
  const currency = useContext(CurrencyContext)
  const dispatch = useContext(CartDispatchContext)

  return <div className='d-flex flex-column border-bottom'>
    <div className='d-flex row-nowrap p-2'>
      <img className='col-6' src={pr.shortcut} />
      <div className='d-flex flex-column col-6 align-items-centers pt-3'>
        <div className='d-flex row-nowrap'>
          <span>{pr.category.name_s} {pr.name}</span>
          <span
            style={{color: 'var(--lime-green)'}}
            className='link h5'
            onClick={() => dispatch({type: 'deleted', category: pr.category.name, name: pr.name, size: pr.size})}
          >
            &nbsp; <FontAwesomeIcon icon='trash' />
          </span>
        </div>
        <span>{t('size')} {pr.size.width} x {pr.size.length}</span>
        {pr.discount != 0 &&
        <span style={{ color: 'var(--deep-sky-blue)' }}>{pr.discount} %</span>
        }
      </div>
    </div>
    <div className='d-flex row-nowrap justify-content-around align-items-center p-2'>
      <div style={{border: '1px solid var(--lime-green)'}} className='d-flex flex-row justify-content-between align-items-center p-3 h5'>
        <div onClick={() => dispatch({
          type: 'updated',
          category: pr.category.name,
          name: pr.name,
          size: pr.size,
          currencies: currencies,
          quantity: pr.quantity === 1 ? pr.quantity : pr.quantity - 1
        })}>
          <span>-</span>
        </div>
        <div style={{width: '2rem'}} className='d-flex justify-content-center'>
          <span>{pr.quantity}</span>
        </div>
        <div onClick={() => dispatch({
          type: 'updated',
          category: pr.category.name,
          name: pr.name,
          size: pr.size,
          currencies: currencies,
          quantity: pr.quantity === 99 ? pr.quantity : pr.quantity + 1
        })}>
          <span>+</span>
        </div>
      </div>
      <span style={{ color: 'var(--deep-sky-blue)' }} className='h6'>
        {t('price')}: {pr.sum[currency]} ({currency})
      </span>
    </div>
  </div>
}