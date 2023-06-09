import React, { useState, useEffect } from "react";
import { Link, useLocation, Location } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next';

import LocationListener from './reusables/LocationListener';
import { getBestProducts, getMattressColectionsPrice } from "./reusables/api";
import { BestProducts, MattressColectionPrice, Price } from "./reusables/JSONTypes.js";
import SearchBar from "./reusables/SearchBar";
import CustomLink from './reusables/CustomLink';

const CATEGORIES = require("../links.json");

interface HeaderProps {
  updateLang: (lang: string) => void
  lang: string
  currency: keyof Price,
  total: number
}

interface Langs {
  [key: string]: string
}
export default function MobileHeader({updateLang, lang, currency, total}: HeaderProps) {
  const Langs: Langs = {
    en: 'english',
    ru: 'russian',
    ro: 'romanian'
  }
  const [bestProducts, setBestProducts] = useState<BestProducts>()
  const [menuOpened, setMenuOpened] = useState(false)
  const langs = () => {
    return Object.keys(Langs).filter((lang: string) => lang != lang)
  }
  const [pathname, setPathname] = useState(useLocation().pathname)
  const [category, setCategory] = useState<string>()
  const [categoryEN, setCategoryEN] = useState<string>()
  const [subCategory, setSubCategory] = useState<string>()
  const [mattressColectionsPrice, setMattressColectionsPrice] = useState<MattressColectionPrice>()
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
    if (locChanged && menuOpened) {
      toggleMenu();
      $('html, body').animate({
        scrollTop: 0
    }, 0);
    }
    setPathname(location.pathname)
    getBestProducts().then(data => {
      setBestProducts(data)
    })
  }

  const toggleMenu = () => {
    setMenuOpened(!menuOpened)
    document.getElementById('header')?.classList.toggle('sticky-top')
    if (!menuOpened) {
      setCategory(undefined)
      setCategoryEN(undefined)
      setSubCategory(undefined)
    }
  }

  const getEnCategory = (category: string) => {
    if (lang == 'en') {
      return category
    }

    const categories = CATEGORIES[lang]
    const keys = Object.keys(categories)
    const categoriesEn = CATEGORIES.en
    
    for (let i = 0; i < keys.length; i++) {
      if (category == keys[i]) {
        return Object.keys(categoriesEn)[i]
      }
    }
    return undefined
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

  return (
    <div id="header" style={{zIndex: 1200}} className="bg-white">
      <LocationListener locationChanged={updateBestProducts} />
      <div style={{boxShadow: '0 1rem 1.5rem -.5rem rgba(0, 0, 0, .25)'}} className="container-fluid row p-3 align-items-center m-0">
        <div className="d-flex col-3 justify-content-center align-items-center">
          <div
            onClick={() => toggleMenu()}
            style={{width: '12vw', height: '9vw'}}
            className="position-relative burger"
          >
            <div
              style={{top: 0}}
              className={(menuOpened ? "burger-sided" : "") + " rounded-pill transition position-absolute bg-dark"}
            />
            <div
              style={{top: '3.6vw'}}
              className={(menuOpened ? "burger-top": "") + " rounded-pill transition position-absolute bg-dark"}
            />
            <div
              style={{top: '3.6vw'}}
              className={(menuOpened ? "burger-bottom" : "") + " rounded-pill transition position-absolute bg-dark"}
            />
            <div
              style={{top: '7.2vw'}}
              className={(menuOpened ? "burger-sided" : "") + " rounded-pill transition position-absolute bg-dark"}
            />
          </div>
        </div>
        <div className="col-4">
          <Link to={"/?lang=" + lang}>
            <img src="/static/images/logo.png"/>
          </Link>
        </div>
        <div className="col-1"></div>
        <div className="col-2 d-flex row-nowrap justify-content-around p-3">
        {Object.keys(langs()).map((lang, index) => {
        return (
          <Link key={index} to={pathname + '?lang=' + lang}>
            <button onClick={() => updateLang(lang)} className="p-2 bg-white border-0 outline-0 no-hover h4">
              <span className="border-bottom">{lang}</span> 
            </button>
          </Link>
        )})}
        </div>
        <div className="col-2 d-flex justify-content-center align-items-center">
          <div
            style={{
              height: '9vw',
              width: '9vw',
              backgroundColor: 'var(--dark-cyan)'
            }}
            className="rounded-circle p-3 d-flex justify-content-center align-items-center"
            data-bs-toggle="tooltip"
            data-bs-placement="bottom"
            title={`${t('order')}: 079 40-70-32`}
          >
            <FontAwesomeIcon icon='phone' color="white" />
          </div>
        </div>
      </div>
      <div style={{left: 0, opacity: 0, height: '100vh'}} className={(menuOpened ? "menu-show" : "menu-hide") + " position-absolute transition bg-white d-flex flex-column overflow-scroll"}>
        <div className="d-flex flex-column">
          <div id="searchBar" style={{backgroundColor: 'var(--dark-cyan)'}} className="w-100 p-3">
            <SearchBar currency={currency as string} width='92.5%' />
          </div>
          <Link
            onClick={() => toggleMenu()}
            to={"/sales?lang=" + lang}
            className="w-100 p-3 border-bottom no-link no-hover"
          >
            <span>{t('sales')}</span>
          </Link>
          <Link
            onClick={() => toggleMenu()}
            to={"/stock?lang=" + lang}
            className="w-100 p-3 border-bottom no-link no-hover"
          >
            <span>{t('stock')}</span>
          </Link>
        {Object.keys(CATEGORIES[lang]).map((category, index) => {
        return (
          <div
            onClick={() => {setCategory(category); setCategoryEN(getEnCategory(category))}}
            key={index}
            className="w-100 p-3 d-flex justify-content-between border-bottom"
          >
            <span>{category}</span>
            <FontAwesomeIcon icon='angle-right' color="var(--lime-green)" />
          </div>
        )})}
          <Link
            onClick={() => toggleMenu()}
            to={"/shops?lang=" + lang}
            className="w-100 p-3 no-link no-hover"
          >
            <span>{t('shops')}</span>
          </Link>
        </div>
        <div style={{backgroundColor: 'var(--milk)'}} className="flex-grow-1 w-100 d-flex row-nowrap">
          <div className="w-50 pt-3 text-center">
            <span>
              <FontAwesomeIcon icon='phone' />
            </span>
            <br/>
            <span className="h6">{t('order')}: <br/>079 40-70-32</span>
          </div>
          <Link
            onClick={() => toggleMenu()}
            to={"/cart?lang=" + lang}
            className="w-50 pt-3 text-center no-link no-hover"
          >
            <span>
              <FontAwesomeIcon icon='shopping-cart' />
            </span>
            <br/>
            <span className="h6">{t('cart')} <br/> {total} ({currency})</span>
          </Link>
        </div>
        <div style={{left: 0, opacity: 0, height: '100vh'}} className={(category ? "menu-show" : "menu-hide") + " position-absolute transition bg-white d-flex flex-column"}>
          <div className="d-flex flex-column">
            <div
              onClick={() => {setCategory(undefined); setCategoryEN(undefined)}}
              style={{backgroundColor: 'var(--dark-cyan)'}}
              className="w-100 p-3 d-flex justify-content-between align-items-center border-bottom text-white"
            >
              <FontAwesomeIcon icon='angle-left' color="white" />
              <span>{category}</span>
            </div>
          {category && Object.keys(CATEGORIES[lang][category]).map((subCategory, index) => {
          return (
            <div
              onClick={() => {
                if (getLink(subCategory) == '') {
                  setSubCategory(subCategory)
                }
                else {
                  toggleMenu()
                }
              }}
              key={index}
              className="w-100 p-3 d-flex justify-content-between border-bottom"
            >
              <CustomLink to={getLink(subCategory)} text={subCategory.split(';')[0]} />
              {CATEGORIES[lang][category as string][subCategory].length != 0 && <FontAwesomeIcon icon='angle-right' color="var(--lime-green)" />}
            </div>
          )})}
          <div className="d-flex align-items-end justify-content-center">
            <span style={{color: 'var(--dark-cyan)'}} className="h4">Hit Sales</span>
          </div>
          {bestProducts && category && bestProducts[categoryEN as keyof BestProducts].map((product, index) => {
            return (
            <div key={index} className={(index != 0 ? "border-top" : "") + " p-2"}>
              <Link className="no-hover no-link text-end" to={`/product/${product.category}/${product.id}?lang=` + lang}>
                <span className="h6">{product.category_name} {product.name}</span>
                <div className="text-start h4" style={{color: 'gold'}}>
                  <FontAwesomeIcon icon={faStar as IconProp}/>
                  {product.discount != 0 &&
                  <span className="ms-2 ms-sm-4" style={{color: 'var(--deep-sky-blue)', borderBottom: '1px solid var(--deep-sky-blue)'}}>
                    -{product.discount}%
                  </span>
                  }
                </div>
                <img src={product.shortcut} />
                {product.discount != 0
                ?
                <div className="d-flex flex-column">
                  <div style={{textDecoration: 'line-through'}}>
                    <span>
                      {`${t('from')} ${product.size.price[currency]} (${currency})`}
                    </span>
                  </div>
                  <div>
                    <span>
                      {`${t('from')} `}
                    </span>
                    <span style={{color: 'var(--lime-green)'}} className="h6">
                      {(product.size.price[currency] * (100 - product.discount) / 100).toFixed(2)}
                    </span>
                    <span>
                      {` (${currency})`}
                    </span>
                  </div>
                </div>
                :
                <div className="d-flex flex-column">
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
            <div style={{height: '20vh'}} className="w-100"></div>
          </div>
        </div>
        <div style={{left: 0, opacity: 0, height: '100vh'}} className={(subCategory ? "menu-show" : "menu-hide") + " position-absolute transition bg-white d-flex flex-column"}>
          <div className="d-flex flex-column">
            <div
              onClick={() => setSubCategory(undefined)}
              style={{backgroundColor: 'var(--dark-cyan)'}}
              className="w-100 p-3 d-flex justify-content-between align-items-center border-bottom text-white"
            >
              <FontAwesomeIcon icon='angle-left' color="white" />
              <span>{subCategory?.split(';')[0]}</span>
            </div>
          {subCategory && CATEGORIES[lang][category as string][subCategory].map((link: string, index: number) => {
          if (subCategory?.endsWith(';Mattress/collection')) {
            return (
              <div key={index} className="w-100 p-3 d-flex justify-content-between border-bottom">
                <CustomLink to={getLink(subCategory, link)} text={link}/>
                <span>{`${t('from')}: ${(mattressColectionsPrice as MattressColectionPrice)[link as keyof MattressColectionPrice].price[currency]} (${currency})`}</span>
              </div>
            )
          }
          return (
            <div key={index} className="w-100 p-3 d-flex justify-content-between border-bottom">
              <CustomLink to={getLink(subCategory as string, link)} text={link}/>
            </div>
          )})}
          </div>
        </div>
      </div>
    </div>
  );
}
