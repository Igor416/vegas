import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';

import { sendSearch } from '../../api'
import { SearchResults } from '../../JSONTypes';
import CustomLink from './CustomLink';
import CustomInput from './CustomInput';

interface SearchBarProps {
  width: string,
  currency: string
}

export default function SearchBar({width, currency}: SearchBarProps) {
  let [search, setSearch] = useState('')
  let [show, setShow] = useState(false)
  let [res, setRes] = useState<SearchResults>({categories: [], products: []})
  const [t, i18n] = useTranslation('search');

  let submitForm = () => {
    if (search.length > 1) {
      setShow(true)
      sendSearch(search, Cookies.get('csrftoken') as string).then(data => setRes(data))
      return
    }
    setRes({categories: [], products: []})
    setShow(false)
  }
  
  useEffect(submitForm, [search])

  return (
    <div onMouseEnter={() => setShow(search.length > 1)} onMouseLeave={() => setShow(false)}>
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
      {Object.keys(res).length != 0 &&
      <div
        style={{zIndex: 1200, width: width}}
        className={(show ? 'search-show' : 'search-hide') + ' border bg-white transition position-absolute py-3 px-4 mt-4'}
      >
        <span className='mb-4'>{t('help')}</span>
      {Object.keys(res).map((key, index) => {
      if (res[key as keyof SearchResults].length != 0) {
        if (key == 'products') {
        return (
          <div key={index} className='w-100 d-flex flex-column border-bottom mt-3'>
            <span className='h5 pb-2'>{t(key)}: </span>
            {res.products.map((item, index) => {
            return (
              <div key={index} className='d-flex row-nowrap justify-content-between text-end link'>
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
            )})}
          </div>
        )}
        else if (key == 'categories') {
        return (
          <div key={index} className='w-100 d-flex flex-column border-bottom mt-3'>
            <span className='h5 pb-2'>{t(key)}: </span>
            {res.categories.map((item, index) => {
            return (
              <div key={index} className='d-flex row-nowrap justify-content-between text-end link'>
                <CustomLink to={item.link} text={item.text} />
                <span>({item.count})</span>
              </div>
            )})}
          </div>
      )}}})}
      </div>
      }
    </div>
  );
}
