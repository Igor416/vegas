import { Link } from "react-router-dom"
import { ResponsiveProps, TranslatableProps } from "../.."
import { CustomButton } from "../reusables"
import { OrderedProduct } from "../../JSONTypes"
import { MobileProductPanel } from "./MobileProductPanel"
import { ProductPanel } from "./ProductPanel"
import { useTotal } from "../../hooks"
import { useContext } from "react"
import { CurrencyContext } from "../../providers"

interface TableProps extends ResponsiveProps, TranslatableProps {
  products: OrderedProduct[]
}

export function Table({isMobile, t, products}: TableProps) {
  const currency = useContext(CurrencyContext)
  const total = useTotal(products, currency)
  
  return <div className='d-flex flex-column'>
    <div className='d-flex flex-row justify-content-between'>
      <span className={'h5' + (isMobile ? ' border-bottom' : '')}>{t('cart')}</span>
    </div>
    {!isMobile &&
    <div
      style={{backgroundColor: 'var(--dark-cyan)'}}
      className='text-white d-flex align-items-center text-center mt-3 rounded-pill'
    >
      <div className='col-2 h-100 h6 py-3 border-end border-white m-0'>
        <span>{t('name')}: </span>
      </div>
      <div className='col-3 h-100 h6 py-3 border-end border-white m-0'>
        <span>{t('shortcut')}: </span>
      </div>
      <div className='col-2 h-100 h6 py-3 border-end border-white m-0'>
        <span>{t('size')}: </span>
      </div>
      <div className='col-1 h-100 h6 py-3 border-end border-white m-0'>
        <span>{t('price')}: ({currency})</span>
      </div>
      <div className='col-1 h-100 h6 py-3 border-end border-white m-0'>
        <span>{t('discount')}: </span>
      </div>
      <div className='col-2 h-100 h6 py-3 border-end border-white m-0'>
        <span>{t('quantity')}: </span>
      </div>
      <div className='col-1 h-100 h6 py-3 m-0'>
        <span>{t('total')}: </span>
      </div>
    </div>
    }
    {products.map((pr, i) => 
    isMobile
    ?
    <MobileProductPanel key={i} t={t} pr={pr} />
    :
    <ProductPanel key={i} t={t} pr={pr} />
    )}
    <div className='d-flex text-center'>
      <Link to='/' className='d-flex justify-content-center no-link col-6 col-sm-2 mt-3 pt-3 '>
        <CustomButton text={t('add')} color='lime-green'/>
      </Link>
      {!isMobile && <div className='col-9 border-end'></div>}
      <div style={{ color: 'var(--deep-sky-blue)' }} className='col-6 col-sm-1 d-flex justify-content-center align-items-center h5 m-0'>
        <span>{total} ({currency})</span>
      </div>
    </div>
  </div>
}