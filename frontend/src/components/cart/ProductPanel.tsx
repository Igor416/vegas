import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { OrderedProduct } from "../../JSONTypes"
import { TranslatableProps } from "../.."
import { useContext } from "react"
import { CartDispatchContext, CurrencyContext } from "../../providers"
import { useCurrencies } from "../../hooks"

interface ProductPanelProps extends TranslatableProps {
  pr: OrderedProduct
}

export function ProductPanel({t, pr}: ProductPanelProps) {
  const currencies = useCurrencies()
  const currency = useContext(CurrencyContext)
  const dispatch = useContext(CartDispatchContext)

  return <div className='d-flex '>
    <div className='col-2 h5 d-flex align-items-center justify-content-center border-bottom border-end m-0'>
      <span>{pr.category.name_s} {pr.name}</span>
      <span
        style={{color: 'var(--lime-green)'}}
        className='link'
        onClick={() => dispatch({type: 'deleted', category: pr.category.name, name: pr.name, size: pr.size})}
      >
        &nbsp;<FontAwesomeIcon icon='trash' />
      </span>
    </div>
    <div className='col-3 border-bottom border-end'>
      <img src={pr.shortcut} />
    </div>
    <div className='col-2 h6 d-flex align-items-center justify-content-center border-bottom border-end m-0'>
      <span>{t('size')} {pr.size.width} x {pr.size.length}</span>
    </div>
    <div className='col-1 h5 d-flex align-items-center justify-content-center border-bottom border-end m-0'>
      <span>{pr.size.price[currency]}</span>
    </div>
    <div className='col-1 h5 d-flex align-items-center justify-content-center border-bottom border-end m-0'>
      <span style={{ color: 'var(--deep-sky-blue)' }}>{pr.discount} %</span>
    </div>
    <div className='col-2 h6 d-flex align-items-center justify-content-center border-bottom border-end m-0'>
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
    </div>
    <div className='col-1 h5 d-flex align-items-center justify-content-center border-bottom m-0'>
      <span style={{ color: 'var(--deep-sky-blue)' }}>{pr.sum[currency]}</span>
    </div>
  </div>
}