import React, { Component } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { StyleSheet, css } from 'aphrodite';
import { withTranslation } from "react-i18next";
import { getCategory, getProduct } from "./reusables/APICallPoints.js";
import Hoverable from './reusables/Hoverable.js';
import { currencies } from './reusables/Globals.js';
import CustomButton from './reusables/CustomButton.js';
import LocationListener from "./reusables/LocationListener.js";
import CustomLink from "./reusables/CustomLink.js";
import SectionImage from "./reusables/SectionImage.js";

const dimensionStyles = StyleSheet.create({
  dimension: {
    fontWeight: 400,

    ':hover': {
      backgroundColor: 'var(--dark-cyan)'
    }
  }
})

function withParams(Component) {
  return props => <Component {...props} params={useParams()} context={useOutletContext()} />;
}

class ProductDetails extends Component {
  constructor(props) {
    super(props);

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
        const structureRaw = data.structure
        const structure = []

        for (let layerRaw of structureRaw) {
          let contains = false
          for (let layer of structure) {
            if (layerRaw.name == layer.name) {
              contains = true
            }
          }
          if (!contains) {
            layerRaw.quantity = layerRaw.technologies[0]
            structure.push(layerRaw)
          }
          else {
            let sameLayers = structureRaw.filter(layer => layer.name == layerRaw.name)
            layerRaw.quantity = layerRaw.technologies[sameLayers.indexOf(layerRaw)]
            structure.push(layerRaw)
          }
        }

        /*
        structureRaw comes with a list of quantities called technologies, with index of quantity corresponding index of same layers.
        So we append layer if it is new, or append quantity with new set id
        */
        data.structure = structure
        this.setState({
          product: data,
          size: data.sizes[0]
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
    let width, length;
    if (dimension == 'width') {
      [width, length] = [value, this.state.size.length]
    }
    else {
      [width, length] = [this.state.size.width, value]
    }
    for (let size of this.state.product.sizes) {
      if (size.width == width && size.length == length) {
        this.setState({
          size: size
        })
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
    
    const t = this.props.t

    if (typeof val == "boolean") {
      return val ? t('yes') : t('no')
    }
  
    return val
  }

  render() {
    const t = this.props.t
    return (
      <div>
        <LocationListener locationChanged={this.updateProduct} />
        <SectionImage category={this.state.category} />
        <div className="container-fluid">
          <div className="row px-5 py-4">
            <div className="col-1" />
            {this.state.product && 
            <div className="col-10">
              <div className="d-flex flex-column mb-5">
                <div className="d-flex row-nowrap h3">
                  <CustomLink to={`/catalog/${this.state.category.name}/all`} text={this.state.category.name_s}/>
                  <span>&nbsp;{this.state.product.name}</span>
                </div>
                <div className="d-flex mt-2 row-nowrap align-items-start">
                  <div className="d-flex flex-column border me-5 p-3">
                    <div style={{zIndex: 1000}} className="position-absolute d-flex p-3 h4">
                      <div style={{color: (this.state.product.best ? 'gold' : 'var(--light-grey)')}}>
                        <FontAwesomeIcon icon="fa-star"/>
                      </div>
                      {this.state.product.discount != 0 &&
                      <div className="ms-4" style={{color: 'var(--deep-sky-blue)', borderBottom: '1px solid var(--deep-sky-blue)'}}>
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
                      <div className="carousel-indicators d-flex row-nowrap justify-content-between mt-3 align-items-stretch">
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
                  <div className="d-flex flex-column">
                    <div className="d-flex border bg-light justify-content-center row-nowrap pt-2 mb-5">
                      <div className="border-end p-3 text-end">
                      {this.state.product.discount != 0 && 
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
                            {this.state.product.discount == 0 ? this.state.size['price' + this.state.currency] : this.state.size['price' + this.state.currency] * (100 - this.state.product.discount) / 100}
                          </span>
                          <span>
                            {` (${this.state.currency})`}
                          </span>
                        </div>
                      </div>
                      <div className="d-flex flex-column p-3">
                      {currencies.map((currency, index) => {
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
                    <div className="d-flex border flex-column mt-5 p-3">
                      <div className="d-flex flex-column flex-wrap align-items-stretch h6">
                      {Object.keys(this.dimensions).map((dimension, index) => {
                      return (
                        <div key={index} className="mt-3">
                          <span>{t(dimension)}:</span>
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
                                className={css(dimensionStyles.dimension) + " p-1 ps-2"}
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
                          <CustomButton color="deepSkyBlue" text={t('buy')} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5">
                <div style={{borderColor: 'var(--deep-sky-blue)'}} className="nav nav-tabs ps-5" id="tab">
                {['description', 'characteristic', 'structure', 'technologies'].map((tab, index) => {
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
                  <div className="flex-column border border-top-0 p-4 tab-pane fade show active" id='description'>
                    <div className="mb-3" style={{whiteSpace: "pre-line"}}>
                      <span>{this.state.product.desc}</span>
                    </div>
                    <div className="row mt-3">
                      <div className="d-flex flex-column justify-content-between col-6 p-4 border">
                        <div>
                        {Object.keys(this.state.product.description).map((key, index) => {
                        return (
                          <div key={index} className="d-flex mb-2 justify-content-between border-bottom">
                            <span>{key}</span>
                            <span className="h6">{this.repr(this.state.product.description[key])}</span>
                          </div>
                        )})}
                        </div>
                        <div onClick={() => {
                          try {
                            $('#tab-characteristic').tab('show');
                            $('#characteristic').tab('show');
                          } catch (error) {
                            //displays error in console, however it works perfectly
                          }
                        }}>
                          <CustomButton text={t('characteristic')} color="deepSkyBlue" />
                        </div>
                      </div>
                      <div className="col-6">
                        <img src={this.state.product.shortcut} />
                      </div>
                    </div>
                  </div>
                  <div className="row-nowrap border border-top-0 p-4 tab-pane fade" id='characteristic'>
                    <div className="d-flex flex-column col-6 justify-content-top border-end p-4">
                      <div className="d-flex mb-2 justify-content-between align-items-center border-bottom">
                        <span>{t('brand')}</span>
                        <span className="h6">Vegas</span>
                      </div>
                      {Object.keys(this.state.product.characteristic).slice(0, 8).map((key, index) => {
                      return (
                      <div key={index} className="d-flex mb-2 justify-content-between align-items-center border-bottom">
                        <span>{key}</span>
                        <span className="h6">{this.repr(this.state.product.characteristic[key])}</span>
                      </div>
                      )})}
                    </div>
                    <div className="d-flex flex-column col-6 justify-content-top p-4">
                      {Object.keys(this.state.product.characteristic).slice(8).map((key, index) => {
                      return (
                      <div key={index} className="d-flex mb-2 justify-content-between align-items-center border-bottom">
                        <span>{key}</span>
                        <span className="h6">{this.repr(this.state.product.characteristic[key])}</span>
                      </div>
                      )})}
                      {['country', 'manufacturer'].map((key, index) => {
                      return (
                      <div key={index} className="d-flex mb-2 justify-content-between align-items-center border-bottom text-end">
                        <span>{t(key)}</span>
                        <span className="h6">{t(key + 'text')}</span>
                      </div>
                      )})}
                      <div className="d-flex mb-2 justify-content-between align-items-center border-bottom">
                        <span>{t('note')}</span>
                        <span className="text-end" style={{fontSize: '0.75em', whiteSpace: "pre-line"}}>{t('notetext')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-column border border-top-0 p-4 tab-pane fade" id='structure'>
                  {this.state.product.structure.map((layer, index) => {
                  return (
                    <div key={index} className="row border-bottom py-4">
                      <div style={{color: 'var(--deep-sky-blue)'}} className="col-2 h5">
                        <span>{layer.name}</span>
                      </div>
                      <div className="col-2 d-flex align-items-center">
                        <div
                          style={{
                            color: 'white',
                            backgroundColor: 'var(--deep-sky-blue)',
                            width: '1.5vw',
                            height: '1.5vw',
                            marginLeft: '-0.75vw'
                          }}
                          className="rounded-circle d-flex align-items-center justify-content-center position-absolute">
                          <span>{layer.quantity}</span>
                        </div>
                        <img src={layer.image} />
                      </div>
                      <div className="col-8">
                        <span>{layer.desc}</span>
                      </div>
                    </div>
                  )})}
                  </div>
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
                </div>
              </div>
            </div>
            }
            <div className="col-1" />
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation('productDetails')(withParams(ProductDetails));