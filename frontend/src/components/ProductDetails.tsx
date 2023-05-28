import React, { useState } from "react";
import { useParams, useOutletContext, Location } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next';

import LocationListener from "./reusables/LocationListener";
import SectionImage from "./reusables/SectionImage";
import { getCategory, getProduct } from "./reusables/api";
import BedSheetsSizesManager from './reusables/BedSheetsSizesManager';
import BedSizesManager from './reusables/BedSizesManager';
import Hoverable from './reusables/Hoverable';
import CustomButton from './reusables/CustomButton';
import CustomLink from "./reusables/CustomLink";
import { OutletContext } from "./App";
import { BedSheetsSize, Category, DetailedProduct, Price, Size } from "./reusables/JSONTypes";

interface Dimensions {
  width: number[],
  length: number[]
}

export default function ProductDetails() {
  let outletContext: OutletContext = useOutletContext()
  let isMobile = outletContext.isMobile;
  const params = useParams()
  const [lang, setLang] = useState(outletContext.lang);
  const [currency, setCurrency] = useState(outletContext.currency)
  const [product, setProduct] = useState<DetailedProduct>()
  const [category, setCategory] = useState<Category>({
    name: params.category as string,
    name_s: '',
    name_pl: '',
    default_filtering: '',
    default_filtering_lang: ''
  })
  const [id, setId] = useState(Number(params.id));
  const [size, setSize] = useState<Size | null>(null);
  const [madeInMD, setMadeInMD] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [tabs, setTabs] = useState<string[]>([])
  const [dimensions, setDimension] = useState<Dimensions>({
    width: [],
    length: []
  })
  const [media, setMedia] = useState<string[]>([])
  const [t, i18n] = useTranslation('productDetails');

  const updateProduct = (path: Location) => {
    setLang(path.search.replace('?lang=', ''))
    let args = path.pathname.slice(1).split('/') //['product', '<category>', '<id>']
    
    setId(Number(id))
    getCategory(args[1]).then((data) => {
      setCategory(data)
      setMadeInMD(['Bed', 'Basis', 'Stand'].includes(data.name))
    })
    getProduct(args[1], id).then((data) => {
      let tabs = ['description', 'characteristic'];
      if (data['structure']) {
        tabs.push('structure')
        if (data['technologies'] && !isMobile) {
          tabs.push('technologies')
        }
      }
      if (category.name == 'Bed') {
        const [extra_length, extra_width] = Object.keys(data.characteristic).slice(2, 4).map(Number)
        data.characteristic[extra_length] = t('mattress') + ' + ' + data.characteristic[extra_length]
        data.characteristic[extra_width] = t('mattress') + ' + ' + data.characteristic[extra_width]
      }
      setProduct(data)
      setSize(data.sizes[0])
      setTabs(tabs)
      let widths = data.sizes.map(size => size.width)
      let lengths = data.sizes.map(size => size.length)
  
      setDimension({
        width: widths.filter((width, index) => widths.indexOf(width) == index),
        length: lengths.filter((length, index) => lengths.indexOf(length) == index)
      }) //remove duplicates

      setMedia([data.shortcut].concat(data.images, data.videos))
    })
  }
  
  const getVideoUrl = (photoUrl: string) => {
    let id = photoUrl.split('/').slice(-1)[0].split('.')[0] // /media/videos/<id>.[jpg|png] -> <id>
    return 'https://www.youtube.com/watch?v=' + id
  }

  const changeSize = (value: number, dimension: string) => {
    if (!product) {
      return
    }
    for (let size of product.sizes) {
      if (size[dimension as keyof Dimensions] == value && size['width' ? 'length' : 'width'] == size['width' ? 'length' : 'width']) {
        setSize(size)
        return
      }
    }
    for (let size of product.sizes) {
      if (size[dimension as keyof Dimensions] == value) {
        setSize(size)
        return
      }
    }
  }

  const updateCurrency = (currency: keyof Price) => {
    setCurrency(currency)
    updateCurrency(currency)
  }

  const repr = (val: any) => {
    //val is array, number or boolean
    if (Array.isArray(val)) {
      return val.join(' / ')
    }

    if (typeof val == "boolean") {
      return val ? t('yes') : t('no')
    }
  
    return val
  }

  return (
    <div className="mt-5">
      <LocationListener locationChanged={updateProduct} />
      {!isMobile && <SectionImage category={category} collection={category.name == 'Mattress' && product?.characteristic['collection'] ? (product?.characteristic['collection'].toString()).toLowerCase() : undefined} />}
      <div className="container-fluid d-flex mt-5 mb-5 px-2 py-1 mb-sm-0 px-sm-5 py-sm-4">
        <div className="col-sm-1"></div>
        {product && 
        <div className="col-sm-10">
          <div className="d-flex flex-column mb-5">
            <div className="d-flex row-nowrap h3">
              <CustomLink to={`/catalog/${category.name}/all`} text={category.name_s}/>
              <span>&nbsp;{product.name}</span>
            </div>
            <div className={(isMobile ? "flex-column" : "row-nowrap") + " d-flex mt-2 align-items-start"}>
              <div className="d-flex flex-column border me-sm-5 p-3">
                <div style={{zIndex: 1000}} className="position-absolute d-flex p-3 h4">
                  <div style={{color: (product.best ? 'gold' : 'var(--milk)')}}>
                    <FontAwesomeIcon icon={faStar as IconProp}/>
                  </div>
                  {product.discount != 0 &&
                  <div className="ms-2 ms-sm-4" style={{color: 'var(--deep-sky-blue)', borderBottom: '1px solid var(--deep-sky-blue)'}}>
                    <span>-{product.discount}%</span>
                  </div>
                  }
                </div>
                <div id="carousel" className="carousel slide" data-interval="false">
                  <div className="carousel-inner">
                  {media.map((url, index) => {
                  return (
                    <div key={index} className={"carousel-item " + (index == 0 ? "active" : "")}>
                    {
                    url.includes('videos')
                    ?
                      <a href={getVideoUrl(url)} target="_blank">
                        <img style={{aspectRatio: 1.512 / 1}} src={url} className="d-block w-100" />
                      </a>
                    :
                      <img style={{aspectRatio: 1.512 / 1}} src={url} className="d-block w-100" />
                    }
                    </div>
                  )})}
                  </div>
                  <button 
                    className="carousel-control-prev h2"
                    style={{width: '5%', color: 'var(--deep-sky-blue)'}} 
                    data-bs-target="#carousel" 
                    data-bs-slide="prev"
                  >
                    <FontAwesomeIcon icon='angle-left' />
                  </button>
                  <button 
                    className="carousel-control-next h2"
                    style={{width: '5%', color: 'var(--deep-sky-blue)'}} 
                    data-bs-target="#carousel" 
                    data-bs-slide="next"
                  >
                    <FontAwesomeIcon icon='angle-right' />
                  </button>
                  <div className={"carousel-indicators d-flex row-nowrap mt-3 align-items-stretch" + (media.length > 1 ? " many-items" : " one-item")}>
                    {media.map((url, index) => {
                    return (
                    <div
                      style={{width: 100 / (media.length + 1) + '%'}}
                      key={index}
                      data-bs-target="#carousel"
                      data-bs-slide-to={index}
                      className={(index == 0 ? "active " : "") + "transition media"}
                    >
                      <img style={{aspectRatio: 1.512 / 1}} src={url} />
                    </div>
                    )})}
                  </div>
                </div>
              </div>
              <div className="d-flex flex-column w-100">
                <div className="d-flex border bg-light justify-content-center row-nowrap pt-2 mt-5 mt-sm-0 mb-sm-5">
                  <div className="border-end p-3 text-end">
                    {(size && (product.discount != 0 || size?.discount != 0)) && 
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
                      {size && <span style={{color: 'var(--lime-green)'}} className="h5">
                        {product.discount == 0
                        ?
                        (size.discount == 0
                        ?
                        size.price[currency]
                        :
                        (size.price[currency] * (100 - size.discount) / 100).toFixed(2)
                        )
                        :
                        (size.discount > product.discount
                        ?
                        (size.price[currency] * (100 - size.discount) / 100).toFixed(2)
                        :
                        (size.price[currency] * (100 - product.discount) / 100).toFixed(2)
                        )
                        }
                      </span>}
                      <span>
                        {` (${currency})`}
                      </span>
                    </div>
                  </div>
                  <div className="d-flex flex-column p-3">
                  {outletContext.getCurrencies().map((currency, index) => {
                  return (
                    <div
                      onClick={() => updateCurrency(currency)}
                      className={"d-flex flex-row " + (currency != currency && "link")}
                      key={index}
                    >
                      <Hoverable text={currency as string}/>
                      <span>&nbsp;</span>
                    </div>
                  )})}
                  </div>
                </div>
                {product['markers'] && size &&
                  <div style={{height: '6vh'}} className="d-flex row-nowrap justify-content-start my-3">
                    {product.markers.map((marker, index) => {
                      return <img className="me-2" key={index} src={marker} style={{width: '6vh', height: '6vh'}}/>
                    })}
                    {size.on_sale &&
                      <img style={{width: '6vh', height: '6vh'}} src="/static/images/sale.jpg"/>
                    }
                  </div>
                }
                <div className="d-flex border flex-column mt-sm-5 p-3">
                {category.name == 'BedSheets'
                ?
                  <BedSheetsSizesManager
                    sizes={product.sizes as BedSheetsSize[]}
                    currentSize={size as BedSheetsSize}
                    changeSize={(size) => setSize(size)}
                  />
                :
                (category.name == 'Bed'
                ?
                  <BedSizesManager
                    extra_width={product['extra_width'] as number}
                    extra_length={product['extra_length'] as number}
                    sizes={product.sizes}
                    currentSize={size as Size}
                    changeSize={(size) => setSize(size)}
                  />
                :
                <div>
                  <div className="d-flex flex-column flex-wrap align-items-stretch h6">
                    {size && ['width', 'length'].map((dimension, index) => {
                    return (
                      <div key={index} className="mt-3">
                        <div className="d-flex justify-content-between">
                          <span>{t(dimension)}:</span>
                          {index == 0 && size.discount != 0 &&
                          <span style={{color: 'var(--deep-sky-blue)'}}>-{size.discount}%</span>
                          }
                        </div>
                        <div className="mt-2">
                          <div className="d-flex justify-content-between border-bottom p-2 dropdown-toggle" data-bs-toggle="dropdown">
                            <span>{size[dimension as keyof Size].toString()}</span>
                            <FontAwesomeIcon icon='angle-down' />
                          </div>
                          <ul className="dropdown-menu">
                          {dimensions[dimension as keyof Dimensions].map((dim, index) => {
                          return (
                            <li
                              onClick={() => size[dimension as keyof Size] != dim && changeSize(dim, dimension)}
                              key={index}
                              className="dimension p-1 ps-2"
                              value={dim}
                            >
                              {dim}
                            </li>
                          )})}
                          </ul>
                        </div>
                      </div>
                    )})}
                    </div>
                  </div>
                  )}
                  <div className="d-flex justify-content-between align-items-stretch pt-3">
                      <div style={{border: '1px solid var(--lime-green)'}} className="d-flex flex-row justify-content-between align-items-center p-3 h5">
                        <div onClick={() => setQuantity(quantity == 1 ? quantity : quantity - 1)}>
                          <span>-</span>
                        </div>
                        <div style={{width: '2rem'}} className="d-flex justify-content-center">
                          <span>{quantity}</span>
                        </div>
                        <div onClick={() => setQuantity(quantity == 99 ? quantity : quantity + 1)}>
                          <span>+</span>
                        </div>
                      </div>
                      <div className="ps-5" onClick={() => outletContext.addProduct(category.name, product, size as Size, quantity)}>
                        <CustomButton color="deep-sky-blue" text={t('buy')} />
                      </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5">
            <div style={{borderColor: 'var(--deep-sky-blue)'}} className="nav nav-tabs ps-1 ps-sm-5" id="tab">
            {tabs.map((tab, index) => {
            if (product[tab as keyof DetailedProduct]) {
            return (
              <button
                key={index}
                id={'tab-' + tab}
                className={'nav-link link' + (index == 0 ? " active" : "")}
                data-bs-toggle="tab"
                data-bs-target={`#${tab}`}
              >
                {t(tab)}
              </button>
            )}})}
            </div>
            <div className="tab-content" id="tabContent">
              <div className="flex-column border border-top-0 p-sm-4 tab-pane fade show active" id='description'>
                <div className="mb-3 p-2 p-sm-0 mt-3 mt-sm-0" style={{whiteSpace: "pre-line"}}>
                  <span>{product.desc}</span>
                </div>
                <div className={(isMobile ? "flex-column" : "row-nowrap") + " d-flex mt-3"}>
                  <div className="d-flex flex-column justify-content-between col-sm-6 p-sm-4">
                    <div>
                    {Object.keys(product.description).map((key, index) => {
                    return (
                      <div key={index} className={(isMobile ? "flex-column" : "row-nowrap") + " d-flex mb-sm-2 justify-content-between border-bottom"}>
                        <span style={{backgroundColor: isMobile ? 'var(--milk)' : ''}} className="p-2 p-sm-0">{key}</span>
                        <span className="h6 p-2 p-sm-0">{repr(product.description[key])}</span>
                      </div>
                    )})}
                    </div>
                    <div className="mt-3 mt-sm-0 mx-auto m-sm-0" onClick={() => {
                      try {
                        $('#tab-characteristic').tab('show');
                        $('#characteristic').tab('show');
                      } catch (error) {
                        //displays error in console, however it works perfectly
                      }
                    }}>
                      <CustomButton text={t('characteristic')} color="deep-sky-blue" />
                    </div>
                  </div>
                  <div className="col-sm-6 d-flex justify-content-end">
                    <img src={product.shortcut} />
                  </div>
                </div>
              </div>
              <div className={(isMobile ? "flex-column" : "row-nowrap") + " border border-top-0 p-sm-4 tab-pane fade"} id='characteristic'>
                <div className={(isMobile ? "" : "border-end") + "d-flex flex-column col-sm-6 justify-content-top p-sm-4"}>
                  <div className={(isMobile ? "flex-column" : "row-nowrap") + " d-flex mb-sm-2 justify-content-between border-bottom"}>
                    <span style={{backgroundColor: isMobile ? 'var(--milk)' : ''}} className="p-2 p-sm-0">{t('brand')}</span>
                    <span className="h6 p-2 p-sm-0">Vegas</span>
                  </div>
                  {Object.keys(product.characteristic).slice(0, 8).map((key, index) => {
                  return (
                  <div key={index} className={(isMobile ? "flex-column" : "row-nowrap") + " d-flex mb-sm-2 justify-content-between border-bottom"}>
                    <span style={{backgroundColor: isMobile ? 'var(--milk)' : ''}} className="p-2 p-sm-0">{key}</span>
                    <span className="h6 p-2 p-sm-0">{repr(product.characteristic[key])}</span>
                  </div>
                  )})}
                </div>
                <div className="d-flex flex-column col-sm-6 justify-content-top p-sm-4">
                  {Object.keys(product.characteristic).slice(8).map((key, index) => {
                  return (
                  <div key={index} className={(isMobile ? "flex-column" : "row-nowrap") + " d-flex mb-sm-2 justify-content-between border-bottom"}>
                    <span style={{backgroundColor: isMobile ? 'var(--milk)' : ''}} className="p-2 p-sm-0">{key}</span>
                    <span className="h6 p-2 p-sm-0">{repr(product.characteristic[key])}</span>
                  </div>
                  )})}
                  {['country', 'manufacturer'].map((key, index) => {
                  return (
                  <div key={index} className={(isMobile ? "flex-column" : "row-nowrap") + " d-flex mb-sm-2 justify-content-between border-bottom"}>
                    <span style={{backgroundColor: isMobile ? 'var(--milk)' : ''}} className="p-2 p-sm-0">{t(key)}</span>
                    <span className="h6 text-end p-2 p-sm-0">{madeInMD ? t(key + 'text1') : t(key + 'text')}</span>
                  </div>
                  )})}
                  <div className={(isMobile ? "flex-column" : "row-nowrap") + " d-flex mb-sm-2 justify-content-between border-bottom"}>
                    <span style={{backgroundColor: isMobile ? 'var(--milk)' : ''}} className="p-2 p-sm-0">{t('note')}</span>
                    <span className="text-end p-2 p-sm-0" style={{fontSize: '0.75em', whiteSpace: "pre-line"}}>{t('notetext')}</span>
                  </div>
                </div>
              </div>
              {tabs.includes('structure') &&
              <div className="flex-column border border-top-0 p-4 tab-pane fade" id='structure'>
              {product.structure.map((layer, index) => {
              return (
                <div key={index} className={(isMobile ? "flex-column" : "row-nowrap") + " d-flex border-bottom py-4"}>
                  <div style={{color: 'var(--deep-sky-blue)'}} className="col-sm-3 h5">
                    <span>{layer.name}</span>
                  </div>
                  <div className="col-sm-2 d-flex align-items-center">
                    <div className="rounded-circle d-flex align-items-center justify-content-center position-absolute text-white structure-quantity">
                      <span>{index + 1}</span>
                    </div>
                    <img src={layer.image} />
                  </div>
                  <div className="col-sm-7">
                    <span>{layer.desc}</span>
                  </div>
                </div>
              )})}
              </div>
              }
              {tabs.includes('technologies') &&
              <div className="flex-column border border-top-0 p-4 tab-pane fade" id='technologies'>
              {product.technologies.map((technology, index) => {
              return (
                <div key={index} className="d-flex row-nowrap border-bottom py-4">
                  <div className="d-flex align-items-center justify-content-center col-2">
                    <img className="w-75" src={technology.image} />
                  </div>
                  <div className="col-10 d-flex flex-column">
                    <div style={{color: 'var(--deep-sky-blue)'}} className="h5">
                      <span>{technology.name}</span>
                    </div>
                    <div>
                      <span>{technology.desc}</span>
                    </div>
                  </div>
                </div>
              )})}
              </div>
              }
            </div>
          </div>
        </div>
        }
        <div className="col-sm-1"></div>
      </div>
    </div>
  );
}