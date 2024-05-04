import { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { sendSearch } from '../../../api'
import { SearchResults } from '../../../JSONTypes';
import { CustomInput, CustomLink } from '../../reusables';
import { CurrencyContext } from '../../../providers';
import { useLocation } from 'react-router-dom';

interface SearchBarProps {
  width: string
}

export function SearchBar({width}: SearchBarProps) {
  const [search, setSearch] = useState('')
  const [show, setShow] = useState(false)
  const location = useLocation()
  const [res, setRes] = useState<SearchResults>({categories: [], products: []})
  const currency = useContext(CurrencyContext)
  const [t, i18n] = useTranslation('search');

  const submitForm = () => {
    setShow(search.length > 1)
    if (search.length > 1) {
      sendSearch(search).then(setRes)
    } else {
      setRes({categories: [], products: []})
    }
  }

  useEffect(() => {
    setSearch('')
    setRes({categories: [], products: []})
    setShow(false)
  }, [location])

  useEffect(submitForm, [search])

  return <div onMouseEnter={() => setShow(search.length > 1)} className='flex-grow-1'>
    <div className='input-group flex-nowrap'>
      <CustomInput
        color='none'
        className='form-control rounded-end rounded-pill bg-light h6 m-0 p-3'
        type='text'
        id='searchQueryInput'
        value={search}
        onChange={value => setSearch(value)}
      />
      <button
        className='input-group-btn px-3 rounded-start rounded-pill mt-n5 bg-light border-0 outline-0 no-hover'
        type='submit'
        name='searchQuerySubmit'
      >
        <svg style={{ width: 24 }} viewBox='0 0 24 24'>
          <path fill='#666666' d='M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z'/>
        </svg>
      </button>
    </div>
    <div
      style={{zIndex: 1200, width: width}}
      className={'border bg-white transition position-absolute py-3 px-4 mt-4 search-' + (show ? 'show' : 'hide')}
      onMouseLeave={() => setShow(false)} 
    >
      <span className='mb-4'>{t('help')}</span>
      {res.categories.length > 0 && <div className='w-100 d-flex flex-column border-bottom mt-3'>
        <span className='h5 pb-2'>{t('categories')}: </span>
        {res.categories.map((item, i) => <div key={i} className='d-flex row-nowrap justify-content-between text-end link'>
            <CustomLink to={item.link} text={item.text} />
            <span>({item.count})</span>
          </div>
        )}
      </div>}
      {res.products.length > 0 && <div className='w-100 d-flex flex-column border-bottom mt-3'>
        <span className='h5 pb-2'>{t('products')}: </span>
        {res.products.map((item, i) => <div key={i} className='d-flex row-nowrap justify-content-between text-end link'>
            <CustomLink to={item.link} text={item.text} />
            {item.discount != 0 && 
            <div style={{fontSize: '0.75em', textDecoration: 'line-through'}}>
              <span>
                {`${t('from')} ${item.price[currency]} (${currency})`}
              </span>
            </div>
            }
            <div>
              <span>
                {`${t('from')} `}
              </span>
              <span style={{color: 'var(--lime-green)'}} className='h6'>
                {(Number(item.price[currency]) * (100 - item.discount) / 100).toFixed(2)}
              </span>
              <span>
                {` (${currency})`}
              </span>
            </div>
          </div>
        )}
      </div>}
    </div>
  </div>
}
