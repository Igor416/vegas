import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { TranslatableProps } from "../../..";
import { BestProduct } from "../../../JSONTypes";
import { useState, useEffect, useContext } from "react";
import { getBestProducts } from "../../../api";
import { CurrencyContext } from "../../../providers";

interface BestProps extends TranslatableProps {
  category: number
}

export function Best({t, i18n, category}: BestProps) {
  const [bestProducts, setBestProducts] = useState<BestProduct[][]>([])
  const currency = useContext(CurrencyContext)

  useEffect(() => {
    getBestProducts().then(setBestProducts)
  }, [i18n?.language])

  return <div className='row'>
    <div className={category === 0 ? 'col-2' : category === 5 ? 'col-6'  : 'col-4'}></div>
    {category > -1 && bestProducts[category].map((product, i) => <div key={i} className={(i != 0 ? 'border-start' : '') + ' col-2 p-2'}>
      <Link className='no-hover no-link text-end' to={`/product/${product.category}/${product.name}`}>
        <span className='h6'>{product.category_name} {product.name}</span>
        <div className='text-start' style={{color: 'gold'}}>
          <FontAwesomeIcon icon={faStar}/>
          {product.discount != 0 &&
          <span className='ms-1 ms-sm-2' style={{color: 'var(--deep-sky-blue)', borderBottom: '1px solid var(--deep-sky-blue)'}}>
            -{product.discount}%
          </span>
          }
        </div>
        <img src={product.shortcut} />
        {product.discount != 0
        ?
        <div className='d-flex flex-column'>
          <div style={{textDecoration: 'line-through'}}>
            <span>
              {`${t('from')} ${product.size.price[currency]} (${currency})`}
            </span>
          </div>
          <div>
            <span>
              {`${t('from')} `}
            </span>
            <span style={{color: 'var(--lime-green)'}} className='h6'>
              {(product.size.price[currency] * (100 - product.discount) / 100).toFixed(2)}
            </span>
            <span>
              {` (${currency})`}
            </span>
          </div>
        </div>
        :
        <div className='d-flex flex-column'>
          <div>
            <span>
              {`${t('from')} ${product.size.price[currency]} (${currency})`}
            </span>
          </div>
        </div>
        }
      </Link>
    </div>)}
    <div className='col-2'></div>
  </div>
}