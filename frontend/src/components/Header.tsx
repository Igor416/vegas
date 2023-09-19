import React, { useState, useEffect } from 'react';
import { Link, useLocation, Location } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next';

import LocationListener from './reusables/LocationListener';
import { getBestProducts, getMattressColectionsPrice, sendHelp } from '../api';
import { BestProducts, MattressColectionPrice, Price, Help } from '../JSONTypes';
import Form from './services/form';
import SearchBar from './reusables/SearchBar';
import Hoverable from './reusables/Hoverable';
import CustomLink from './reusables/CustomLink';
import CustomButton from './reusables/CustomButton';
import CustomPhoneInput from './reusables/CustomPhoneInput';
import CustomInput from './reusables/CustomInput';

const CATEGORIES = require('../links.json');

interface HeaderProps {
  updateLang: (lang: string) => void
  lang: string
  currency: keyof Price,
  total: number
}

interface Langs {
  [key: string]: string
}

export default function Header({updateLang, lang, currency, total}: HeaderProps) {
  let inMenu = false;
  let inActualLinks = false;
  const Langs: Langs = {
    en: 'english',
    ru: 'russian',
    ro: 'romanian'
  }
  const [bestProducts, setBestProducts] = useState<BestProducts | null>()
  const langs = () => {
    return Object.keys(Langs).filter((l: string) => l != lang)
  }
  const [pathname, setPathname] = useState(useLocation().pathname)
  let [category, setCategory] = useState<string | null>(null)
  let [categoryEN, setCategoryEN] = useState<string | null>(null)
  let [subCategory, setSubCategory] = useState<string | null>(null)
  const [mattressColectionsPrice, setMattressColectionsPrice] = useState<MattressColectionPrice>()
  const [ordered, setOrdered] = useState(false)
  const form = new Form<Help>(sendHelp)
  const [data, setData] = useState<Help>({} as Help)
  const [error, setError] = useState(false)
  const [t, i18n] = useTranslation('header');

  useEffect(() => {
    getMattressColectionsPrice().then(data => {
      let sortedData: MattressColectionPrice = {}
      for (let el of data) {
        sortedData[Object.keys(el)[0]] = Object.values(el)[0]
      }
      
      setMattressColectionsPrice(sortedData)
    })
  }, [])

  const updateBestProducts = (location: Location, locChanged: boolean) => {
    if (locChanged) {
      setCategory(null)
      setCategoryEN(null)
      setSubCategory(null)
    }
    setPathname(location.pathname)
    getBestProducts().then(data => {
      setBestProducts(data)
    })
  }

  const onMouseEnter = (newInMenu: boolean, newCategory: string | null =null, newSubCategory: string | null=null, newInActualLinks=false) => {
    if (!newInMenu) {
      category = newCategory
    }
    else {
      if (newSubCategory) {
        subCategory = newSubCategory
      }
    }
    setCategory(category)
    setCategoryEN(getEnCategory(category))
    setSubCategory(subCategory)
    inMenu = newInMenu;
    inActualLinks = newInActualLinks
  }

  const onMouseLeave = (inSubCategories=false, newSubCategory: string | null=null, newInActualLinks=false) => {
    inMenu = inSubCategories
    inActualLinks = newInActualLinks
    if (newInActualLinks) {
      setSubCategory(null)
    }
    setTimeout(() => {
      if ((inSubCategories !== Boolean(newSubCategory)) && !inActualLinks) {
        setSubCategory(null)
      }
      if (!inMenu) {
        setCategory(null)
        setCategoryEN(null)
        setSubCategory(null)
      }
    }, 20)
  }

  const getEnCategory = (category: string | null) => {
    if (lang == 'en') {
      return category
    }

    let categories = CATEGORIES[lang]
    let keys = Object.keys(categories)
    let categoriesEn = CATEGORIES.en
    
    for (let i = 0; i < keys.length; i++) {
      if (category == keys[i]) {
        return Object.keys(categoriesEn)[i]
      }
    }
    return null
  }

  const getLink = (subCategory: string, link: string | null = null): string => {
    if (category && categoryEN) {
      let categories = CATEGORIES[lang][category]
      if (categoryEN == 'BASISES') {
        return `/product/Basis/${Object.keys(categories).indexOf(subCategory) * 2 + 1}`
      }
      if (categories[subCategory].length == 0 || link) {
        let url = `/catalog/${subCategory.split(';')[1]}`
        if (link) {
          if (lang == 'en') {
            url += '/' + link
          }
          else {
            let keys = categories[subCategory]
            for (let link_id = 0; link_id < keys.length; link_id++) {
              if (keys[link_id] == link) {
                url += '/' + (Object.values(CATEGORIES.en[categoryEN])[Object.keys(categories).indexOf(subCategory)] as string[])[link_id]
              }
            }
          }
        }
        return url
      }
    }
    return ''
  }

  const submitForm = () => {
    let r = form.submitForm(data)

    if (r == 'error: empty') {
      setError(true)
    }
    else {
      $(function () {
        $('#modal').modal('toggle');
     });
    }
  }
  
  return (
    <div className='bg-white'>
    <LocationListener locationChanged={updateBestProducts} />
      <div className='container-fluid d-flex align-items-center row px-5 pt-4'>
        <div className='col-1'></div>
        <div className='col-1'>
          <Link to='/'>
            <img style={{ maxWidth: '80%' }} src='/static/images/logo.png'/>
          </Link>
        </div>
        <div id='searchBar' className='col-3 ps-0'>
          <SearchBar width={String(document.getElementById('searchBar')?.offsetWidth)} currency={currency as string} />
        </div>
        <div className='col-1 d-flex flex-column align-items-center'>
        {langs().map((l, index) => {
        return (
          <button key={index} onClick={() => updateLang(l)} className='p-2 bg-white border-0 outline-0 no-hover'>
            <img className='border' style={{ width: '2.5vw' }} src={'/static/images/' + Langs[l] + '.png'}/>
          </button>
        )})}
        </div>
        <div className='col-2 text-center border-start border-end'>
          <FontAwesomeIcon icon='phone' />
          <br/>
          <span className='h6'>{t('order')}: <br/>079 40-70-32</span>
        </div>
        <div className='col-2 text-center border-end' data-bs-toggle='modal' data-bs-target='#modalHelp'>
          <FontAwesomeIcon icon='hand-holding-usd' />
          <br/>
          <span className='h6' style={{whiteSpace: 'pre-line'}}>{t('credit')}</span>
        </div>
        <div className='col-1 text-center'>
          <Link to='/cart' className='h6 no-link no-hover'>
            <FontAwesomeIcon icon='shopping-cart' />
            <br/>
            <span className='text-nowrap'>{t('cart')} <br/> {total} ({currency})</span>
          </Link>
        </div>
        <div className='col-1'></div>
      </div>
      <nav style={{zIndex: 1020}} className='container-fluid position-absolute bg-white px-5 pt-4'>
        <div className='row'>
          <div className='col-1'></div>
          <div className='col-10 h6 m-0'>
            <div className='d-flex flex-inline justify-content-between transition'>
              <div>
                <CustomLink to='/sales' text={t('sales')} />
              </div>
              <div>
                <CustomLink to='/stock' text={t('stock')} />
              </div>
              {Object.keys(CATEGORIES[lang]).map((c, index) => {
              return (
                <div
                  className='d-flex flex-row pb-2'
                  key={index}
                  onMouseEnter={() => onMouseEnter(false, c)}
                  onMouseLeave={() => onMouseLeave()}
                >
                  <Hoverable text={c} />
                  &nbsp;
                  <FontAwesomeIcon className={(c == category ? 'angle-active' : 'angle-unactive') + ' transition'} icon='angle-down' /> 
                </div>
              )})}
              <div>
                <CustomLink to='/shops' text={t('shops')} />
              </div>
            </div>
          </div>
          <div className='col-1'></div>
        </div>
        <div
          onMouseEnter={() => onMouseEnter(true)}
          onMouseLeave={() => onMouseLeave()}
          className={(category ? 'menu-show' : 'menu-hide') + ' d-flex flex-column transition'}
        >
          <div className='row border-top py-2'>
            <div className='col-2'></div>
            <div
              className='col-2'
              onMouseLeave={() => category && onMouseLeave(true)}
            >
              {category && Object.keys(CATEGORIES[lang][category]).map((subCategory, index) => {
              return (
                <div
                  className='d-flex pb-2'
                  key={index}
                  onMouseEnter={() => onMouseEnter(true, category, subCategory)}
                  onMouseLeave={() => onMouseLeave(true, subCategory)}
                >
                  <CustomLink to={getLink(subCategory)} text={subCategory.split(';')[0]} />
                </div>
              )})}
            </div>
            <div
              className='col-4 border-start'
              onMouseEnter={() => subCategory && onMouseEnter(true, category, subCategory, true)}
              onMouseLeave={() => subCategory && onMouseLeave(true, subCategory, true)}
            >
              {subCategory && CATEGORIES[lang][category as string][subCategory].map((link: string, index: number) => {
              if (subCategory?.endsWith(';Mattress/collection') && mattressColectionsPrice) {
                return (
                  <div className='d-flex pb-2' key={index}>
                    <CustomLink to={getLink(subCategory, link)} text={`${link}    ${t('from')}: ${mattressColectionsPrice[link].price[currency]} (${currency})`}/>
                  </div>
                )
              }
              return (
                <div
                  className={'d-flex pb-2'}
                  key={index}
                >
                  <CustomLink to={getLink(subCategory as string, link)} text={link}/>
                </div>
              )})}
            </div>
            <div className='col-2'>
            </div>
          </div>
          {bestProducts &&
          <div className='row py-2'>
            <div className='col-6'></div>
            <div className='col-2 d-flex align-items-end justify-content-center'>
              <span style={{color: 'var(--dark-cyan)'}} className='h4'>Hit Sales</span>
            </div>
          </div>
          }
          <div className='row'>
            <div className={categoryEN == 'MATTRESSES' ? 'col-2' : 'col-4'}></div>
            {bestProducts && category && bestProducts[categoryEN as keyof BestProducts].map((product, index) => {
            return (
            <div key={index} className={(index != 0 ? 'border-start' : '') + ' col-2 p-2'}>
              <Link className='no-hover no-link text-end' to={`/product/${product.category}/${product.name}`}>
                <span className='h6'>{product.category_name} {product.name}</span>
                <div className='text-start' style={{color: 'gold'}}>
                  <FontAwesomeIcon icon={faStar as IconProp}/>
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
            </div>
            )})}
            <div className='col-2'></div>
          </div>
        </div>
      </nav>
      <div className='modal fade' id='modalHelp' tabIndex={-1}>
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <div>
                <span className='h3'>{t('credit')}</span>
                <br/>
                <span>({t('procent')})</span>
              </div>
              <button onClick={() => {setOrdered(false); setError(false)}} type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
            </div>
            <div className='modal-body h6'>
              <ol>
                <li>Maib - LiberCard (6 {t('months')})</li>
                <li>Start Credit (4-6 {t('months')})</li>
              </ol>
              <span className='h6 text-danger'>{error ? t('error') : ''}</span>
              <form style={{display: ordered ? 'block' : 'none'}} className='mt-3'>
                <label htmlFor='name'>{t('name')}</label>
                <br/>
                <CustomInput
                  color='dark-cyan'
                  className='px-0 mb-3'
                  type='text'
                  id='name'
                  value={data.name}
                  onChange={value => setData(form.updateForm(data, 'name', value))}
                />
                <CustomPhoneInput
                  lang={lang}
                  color='dark-cyan' 
                  phone={data.phone}
                  setPhone={phone => setData(form.updateForm(data, 'phone', phone))}
                />
              </form>
            </div>
            <div className='d-flex justify-content-between modal-footer'>
              <div onClick={() => {setOrdered(false); setError(false)}} data-bs-dismiss='modal'>
                <CustomButton color='lime-green' text={t('close')} />
              </div>
              {ordered
              ?
              <div onClick={submitForm}>
                <CustomButton color='deep-sky-blue' text={t('submit')} />
              </div>
              :
              <div onClick={() => setOrdered(true)}>
                <CustomButton color='deep-sky-blue' text={t('call')} />
              </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
