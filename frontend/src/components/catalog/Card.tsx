import { faStar } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"
import { Hoverable, CustomButton } from "../reusables"
import { ListProduct } from "../../JSONTypes"
import { ResponsiveProps, TranslatableProps } from "../.."
import { useContext } from "react"
import { CurrencyContext } from "../../providers"

interface CardProps extends ResponsiveProps, TranslatableProps {
  product: ListProduct,
  isSales: boolean,
  isGrid: boolean,
  setActive: (val: ListProduct) => void
}

export function Card({isMobile, t, product, isSales, isGrid, setActive}: CardProps) {
  const currency = useContext(CurrencyContext)

  return <div className='d-flex shadow no-link mb-3 p-3'>
    <div style={{zIndex: 1000}} className='position-absolute d-flex p-3 h4'>
      <div style={{color: (product.best ? 'gold' : 'var(--milk)')}}>
        <FontAwesomeIcon icon={faStar}/>
      </div>
      {product.discount != 0 &&
      <div className='ms-2 ms-sm-4' style={{color: 'var(--deep-sky-blue)', borderBottom: '1px solid var(--deep-sky-blue)'}}>
        <span>-{product.discount}%</span>
      </div>
      }
    </div>
    <div className='d-flex row-nowrap'>
      <div className='position-relative d-flex flex-column flex-grow-1 flex-shrink-1'>
        <img src={product.shortcut}/>
        {isSales &&
        <div className='position-absolute bottom-0 start-0 h5'>
          <span>{`${product.size.length} x ${product.size.width}`}</span>
        </div>
        }
      </div>
      {isGrid && product.markers &&
      <div style={{width: isMobile ? '50vw' : '12.5vw', height: isMobile ? 'calc(50vw + 2.5rem)' : 'calc(12.5vw + 2.5rem)'}} className='d-flex flex-column justify-content-start mt-3'>
        {product.markers.map((marker, i) => {
          return <img key={i} className='mb-2' src={marker}/>
        })}
      </div>
      }
    </div>
    <div className='d-flex mt-3 flex-column justify-content-between'>
      <div className='price d-flex flex-row justify-content-between align-items-end'>
        <div className='h5 m-0'>
          <Hoverable text={product.name} />
        </div>
        <div className='d-flex flex-column text-end'>
        {product.discount != 0
        ?
          <div className='d-flex flex-column'>
            <div style={{textDecoration: 'line-through'}}>
              <span>
                {`${product.size.price[currency]} (${currency})`}
              </span>
            </div>
            <div>
              <span>
                {isSales ? '' : `${t('from')} `}
              </span>
              <span style={{color: 'var(--lime-green)'}} className='h5'>
                {(product.size.price[currency] * (100 - product.discount) / 100).toFixed(2)}
              </span>
              <span>
                {` (${currency})`}
              </span>
            </div>
          </div>
        :
          <div className='d-flex flex-column'>
            <span>
              {isSales ? '' : `${t('from')} `}{product.size.price[currency]} ({currency})
            </span>
          </div>
        }
        </div>
      </div>
      <div className='desc py-3 border-bottom border-muted'>
        <span>{product.desc}</span>
      </div>
      {!isGrid && product.markers &&
      <div style={{height: '5vh'}} className='d-flex row-nowrap justify-content-start'>
        {product.markers.map((marker, i) => <img key={i} src={marker} style={{width: '5vh', height: '5vh'}} className='me-2' />)}
      </div>
      }
      <div className='d-flex mt-4 flex-row row-nowrap justify-content-between h5'>
        <Link to={`/product/${product.category.name}/${product.name}`}>
          <CustomButton color='lime-green' text={t('details')} />
        </Link>
        <div onClick={() => setActive(product)} data-bs-toggle='modal' data-bs-target='#modalDetails'>
          <CustomButton color='deep-sky-blue' text={t('call')} />
        </div>
      </div>
    </div>
  </div>
}