import React, { Component } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withTranslation } from "react-i18next";

import LocationListener from "./reusables/LocationListener.js";
import SectionImage from "./reusables/SectionImage.js";
import { getCategory, getProduct } from "./reusables/APICallPoints.js";
import BedSheetsSizesManager from './reusables/BedSheetsSizesManager.js';
import BedSizesManager from './reusables/BedSizesManager.js';
import Hoverable from './reusables/Hoverable.js';
import CustomButton from './reusables/CustomButton.js';
import CustomLink from "./reusables/CustomLink.js";

function withParams(Component) {
  return props => <Component {...props} params={useParams()} context={useOutletContext()} />;
}

class ProductDetails extends Component {
  constructor(props) {
    super(props);

    this.isMobile = this.props.context.isMobile;
    this.state = {
      lang: this.props.context.lang,
      currency: this.props.context.currency,
      product: null,
      category: {
        name: this.props.params.category
      },
      id: this.props.params.id,
      size: null,
      quantity: 1
    }

    this.updateProduct = this.updateProduct.bind(this);
  }

  updateProduct(path) {
    let lang = path.search.replace('?lang=', '');
    let [_, category, id] = path.pathname.slice(1).split('/') //['product', '<category>', '<id>']

    this.setState({
      lang: lang,
      category: {
        name: category
      },
      id: id
    }, () => {
      getCategory(category).then((data) => {
        this.setState({
          category: data
        })
      })
      getProduct(category, id).then((data) => {
        let tabs = ['description', 'characteristic'];
        if (data['structure']) {
          tabs.push('structure')
          if (data['technologies'] && !this.isMobile) {
            tabs.push('technologies')
          }
        }

        this.setState({
          product: data,
          size: data.sizes[0],
          tabs: tabs
        })
        let widths = data.sizes.map(size => size.width)
        let lengths = data.sizes.map(size => size.length)
    
        this.dimensions = {
          width: widths.filter((width, index) => widths.indexOf(width) == index),
          length: lengths.filter((length, index) => lengths.indexOf(length) == index)
        } //remove duplicates

        this.media = [data.shortcut].concat(data.images, data.videos)
      })
    })
  }
  
  getVideoUrl(photoUrl) {
    let id = photoUrl.split('/').slice(-1)[0].split('.')[0] // /media/videos/<id>.[jpg|png] -> <id>
    return 'https://www.youtube.com/watch?v=' + id
  }

  changeSize(value, dimension) {
    for (let size of this.state.product.sizes) {
      if (size[dimension] == value) {
        this.setState({
          size: size
        })
        return
      }
    }
  }

  updateCurrency(currency) {
    this.setState({
      currency: currency
    })
    this.props.context.updateCurrency(currency)
  }

  repr(val) {
    //val is array, number or boolean
    if (Array.isArray(val)) {
      return val.join(' / ')
    }

    if (typeof val == "boolean") {
      return val ? this.props.t('yes') : this.props.t('no')
    }
  
    return val
  }

  render() {
    const t = this.props.t
    return (
      <div className="mt-5">
        <LocationListener locationChanged={this.updateProduct} />
        {!this.isMobile && <SectionImage category={this.state.category} collection={this.state.category.name == 'Mattress' ? this.state.product?.characteristic.Collection.toLowerCase() : null} />}
        <div className="container-fluid d-flex mt-5 mb-5 px-2 py-1 mb-sm-0 px-sm-5 py-sm-4">
          <div className="col-sm-1"></div>
          {this.state.product && 
          <div className="col-sm-10">
            <div className="d-flex flex-column mb-5">
              <div className="d-flex row-nowrap h3">
                <CustomLink to={`/catalog/${this.state.category.name}/all`} text={this.state.category.name_s}/>
                <span>&nbsp;{this.state.product.name}</span>
              </div>
              <div className={(this.isMobile ? "flex-column" : "row-nowrap") + " d-flex mt-2 align-items-start"}>
                <div className="d-flex flex-column border me-sm-5 p-3">
                  <div style={{zIndex: 1000}} className="position-absolute d-flex p-3 h4">
                    <div style={{color: (this.state.product.best ? 'gold' : 'var(--milk)')}}>
                      <FontAwesomeIcon icon="fa-star"/>
                    </div>
                    {this.state.product.discount != 0 &&
                    <div className="ms-2 ms-sm-4" style={{color: 'var(--deep-sky-blue)', borderBottom: '1px solid var(--deep-sky-blue)'}}>
                      <span>-{this.state.product.discount}%</span>
                    </div>
                    }
                  </div>
                  <div id="carousel" className="carousel slide" data-interval="false">
                    <div className="carousel-inner">
                    {this.media.map((url, index) => {
                    return (
                      <div key={index} className={"carousel-item " + (index == 0 ? "active" : "")}>
                      {
                      url.includes('videos')
                      ?
                        <a href={this.getVideoUrl(url)} target="_blank">
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
                    <div className={"carousel-indicators d-flex row-nowrap mt-3 align-items-stretch" + (this.media.length > 1 ? " many-items" : " one-item")}>
                      {this.media.map((url, index) => {
                      return (
                      <div
                        style={{width: 100 / (this.media.length + 1) + '%'}}
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
                    {(this.state.product.discount != 0 || this.state.size.discount != 0) && 
                      <div style={{textDecoration: 'line-through'}}>
                        <span>
                          {`${t('old_price')}: ${this.state.size['price' + this.state.currency]} (${this.state.currency})`}
                        </span>
                      </div>
                    }
                      <div>
                        <span>
                          {`${t('current_price')}: `}
                        </span>
                        <span style={{color: 'var(--lime-green)'}} className="h5">
                          {this.state.product.discount == 0
                          ?
                          (this.state.size.discount == 0
                          ?
                          this.state.size['price' + this.state.currency]
                          :
                          (this.state.size['price' + this.state.currency] * (100 - this.state.size.discount) / 100).toFixed(2)
                          )
                          :
                          (this.state.size.discount > this.state.product.discount
                          ?
                          (this.state.size['price' + this.state.currency] * (100 - this.state.size.discount) / 100).toFixed(2)
                          :
                          (this.state.size['price' + this.state.currency] * (100 - this.state.product.discount) / 100).toFixed(2)
                          )
                          }
                        </span>
                        <span>
                          {` (${this.state.currency})`}
                        </span>
                      </div>
                    </div>
                    <div className="d-flex flex-column p-3">
                    {this.props.context.getCurrencies().map((currency, index) => {
                    return (
                      <div
                        onClick={() => this.updateCurrency(currency)}
                        className={"d-flex flex-row " + (currency != this.state.currency && "link")}
                        key={index}
                      >
                        <Hoverable text={currency} isActive={currency == this.state.currency}/>
                        <span>&nbsp;</span>
                      </div>
                    )})}
                    </div>
                  </div>
                  {this.state.product.markers &&
                    <div style={{height: '6vh'}} className="d-flex row-nowrap justify-content-start my-3">
                      {this.state.product.markers.map((marker, index) => {
                        return <img className="me-2" key={index} src={marker} style={{width: '6vh', height: '6vh'}}/>
                      })}
                      {this.state.size.on_sale &&
                        <img style={{width: '6vh', height: '6vh'}} src="/static/images/sale.jpg"/>
                      }
                    </div>
                  }
                  <div className="d-flex border flex-column mt-sm-5 p-3">
                  {this.state.category.name == 'BedSheets'
                  ?
                    <BedSheetsSizesManager
                      sizes={this.state.product.sizes}
                      currentSize={this.state.size}
                      changeSize={(size) => this.setState({size: size})}
                    />
                  :
                  (this.state.category.name == 'Bed'
                  ?
                    <BedSizesManager
                      extra_width={this.state.product['extra_width']}
                      extra_length={this.state.product['extra_length']}
                      sizes={this.state.product.sizes}
                      currentSize={this.state.size}
                      changeSize={(size) => this.setState({size: size})}
                    />
                  :
                  <div>
                      <div className="d-flex flex-column flex-wrap align-items-stretch h6">
                      {Object.keys(this.dimensions).map((dimension, index) => {
                      return (
                        <div key={index} className="mt-3">
                          <div className="d-flex justify-content-between">
                            <span>{t(dimension)}:</span>
                            {index == 0 && this.state.size.discount != 0 &&
                            <span style={{color: 'var(--deep-sky-blue)'}}>-{this.state.size.discount}%</span>
                            }
                          </div>
                          <div className="mt-2">
                            <div className="d-flex justify-content-between border-bottom p-2 dropdown-toggle" data-bs-toggle="dropdown">
                              <span>{this.state.size[dimension]}</span>
                              <FontAwesomeIcon icon='angle-down' />
                            </div>
                            <ul className="dropdown-menu">
                            {this.dimensions[dimension].map((dim, index) => {
                            return (
                              <li
                                onClick={() => this.state.size[dimension] != dim && this.changeSize(dim, dimension)}
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
                          <div onClick={() => this.setState({quantity: this.state.quantity == 1 ? this.state.quantity : this.state.quantity - 1})}>
                            <span>-</span>
                          </div>
                          <div style={{width: '2rem'}} className="d-flex justify-content-center">
                            <span>{this.state.quantity}</span>
                          </div>
                          <div onClick={() => this.setState({quantity: this.state.quantity == 99 ? this.state.quantity : this.state.quantity + 1})}>
                            <span>+</span>
                          </div>
                        </div>
                        <div className="ps-5" onClick={() => this.props.context.addProduct(this.state.category.name, this.state.product, this.state.size, this.state.quantity)}>
                          <CustomButton color="deep-sky-blue" text={t('buy')} />
                        </div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5">
              <div style={{borderColor: 'var(--deep-sky-blue)'}} className="nav nav-tabs ps-1 ps-sm-5" id="tab">
              {this.state.tabs.map((tab, index) => {
              if (this.state.product[tab]) {
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
                    <span>{this.state.product.desc}</span>
                  </div>
                  <div className={(this.isMobile ? "flex-column" : "row-nowrap") + " d-flex mt-3"}>
                    <div className="d-flex flex-column justify-content-between col-sm-6 p-sm-4">
                      <div>
                      {Object.keys(this.state.product.description).map((key, index) => {
                      return (
                        <div key={index} className={(this.isMobile ? "flex-column" : "row-nowrap") + " d-flex mb-sm-2 justify-content-between border-bottom"}>
                          <span style={{backgroundColor: this.isMobile ? 'var(--milk)' : ''}} className="p-2 p-sm-0">{key}</span>
                          <span className="h6 p-2 p-sm-0">{this.repr(this.state.product.description[key])}</span>
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
                      <img src={this.state.product.shortcut} />
                    </div>
                  </div>
                </div>
                <div className={(this.isMobile ? "flex-column" : "row-nowrap") + " border border-top-0 p-sm-4 tab-pane fade"} id='characteristic'>
                  <div className={(this.isMobile ? "" : "border-end") + "d-flex flex-column col-sm-6 justify-content-top p-sm-4"}>
                    <div className={(this.isMobile ? "flex-column" : "row-nowrap") + " d-flex mb-sm-2 justify-content-between border-bottom"}>
                      <span style={{backgroundColor: this.isMobile ? 'var(--milk)' : ''}} className="p-2 p-sm-0">{t('brand')}</span>
                      <span className="h6 p-2 p-sm-0">Vegas</span>
                    </div>
                    {Object.keys(this.state.product.characteristic).slice(0, 8).map((key, index) => {
                    return (
                    <div key={index} className={(this.isMobile ? "flex-column" : "row-nowrap") + " d-flex mb-sm-2 justify-content-between border-bottom"}>
                      <span style={{backgroundColor: this.isMobile ? 'var(--milk)' : ''}} className="p-2 p-sm-0">{key}</span>
                      <span className="h6 p-2 p-sm-0">{this.repr(this.state.product.characteristic[key])}</span>
                    </div>
                    )})}
                  </div>
                  <div className="d-flex flex-column col-sm-6 justify-content-top p-sm-4">
                    {Object.keys(this.state.product.characteristic).slice(8).map((key, index) => {
                    return (
                    <div key={index} className={(this.isMobile ? "flex-column" : "row-nowrap") + " d-flex mb-sm-2 justify-content-between border-bottom"}>
                      <span style={{backgroundColor: this.isMobile ? 'var(--milk)' : ''}} className="p-2 p-sm-0">{key}</span>
                      <span className="h6 p-2 p-sm-0">{this.repr(this.state.product.characteristic[key])}</span>
                    </div>
                    )})}
                    {['country', 'manufacturer'].map((key, index) => {
                    return (
                    <div key={index} className={(this.isMobile ? "flex-column" : "row-nowrap") + " d-flex mb-sm-2 justify-content-between border-bottom"}>
                      <span style={{backgroundColor: this.isMobile ? 'var(--milk)' : ''}} className="p-2 p-sm-0">{t(key)}</span>
                      <span className="h6 text-end p-2 p-sm-0">{t(key + 'text')}</span>
                    </div>
                    )})}
                    <div className={(this.isMobile ? "flex-column" : "row-nowrap") + " d-flex mb-sm-2 justify-content-between border-bottom"}>
                      <span style={{backgroundColor: this.isMobile ? 'var(--milk)' : ''}} className="p-2 p-sm-0">{t('note')}</span>
                      <span className="text-end p-2 p-sm-0" style={{fontSize: '0.75em', whiteSpace: "pre-line"}}>{t('notetext')}</span>
                    </div>
                  </div>
                </div>
                {this.state.tabs.includes('structure') &&
                <div className="flex-column border border-top-0 p-4 tab-pane fade" id='structure'>
                {this.state.product.structure.map((layer, index) => {
                return (
                  <div key={index} className={(this.isMobile ? "flex-column" : "row-nowrap") + " d-flex border-bottom py-4"}>
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
                {this.state.tabs.includes('technologies') &&
                <div className="flex-column border border-top-0 p-4 tab-pane fade" id='technologies'>
                {this.state.product.technologies.map((technology, index) => {
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
}

export default withTranslation('productDetails')(withParams(ProductDetails));