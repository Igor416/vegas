import React, { Component } from "react";
import { useParams, useOutletContext, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Cookies from 'js-cookie'
import { withTranslation } from "react-i18next";

import LocationListener from "./reusables/LocationListener.js";
import SectionImage from "./reusables/SectionImage.js";
import { getCategory, getProducts, getSales, sendForm } from "./reusables/APICallPoints.js";
import { currencies } from './reusables/Globals.js';
import Hoverable from './reusables/Hoverable.js';
import CustomButton from './reusables/CustomButton.js';
import CustomPhoneInput from './reusables/CustomPhoneInput.js';

function withParams(Component) {
  return props => <Component {...props} params={useParams()} context={useOutletContext()} />;
}

class Catalog extends Component {
  constructor(props) {
    super(props);

    this.isMobile = this.props.context.isMobile;
    this.state = {
      isGrid: true,
      lang: this.props.context.lang,
      currency: this.props.context.currency,
      category: {
        name: this.props.params.category ? this.props.params.category : 'sales'
      },
      sub_category: this.props.params.sub_category,
      filter: this.props.params.filter,
      active: null,
      form: {
        error: false,
        name: '',
        phone: ''
      },
    }
    
    this.updateProducts = this.updateProducts.bind(this);
    this.changeLayout = this.changeLayout.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  updateProducts(path) {
    let lang = path.search.replace('?lang=', '');
    let [type, category, sub_category, filter] = path.pathname.slice(1).split('/')
    //['catalog|sales', '<category>', '<sub_category>', '<?filter>']

    if (type == 'catalog') {
      this.setState({
        lang: lang,
        category: {
          name: category
        },
        sub_category: sub_category,
        filter: filter || null
      }, () => {
        getCategory(category).then((category_data) => {
          this.setState({
            category: category_data
          }, () => {
            getProducts(category, sub_category, filter).then((data) => {
              let sorted_products = {};
              let filtering, remainder;
  
              if (Array.isArray(data[0][category_data.default_filtering])) {
                for (let i = 0; i < data.length; i++) {
                  for (let j = 0; j < ( data.length - i -1 ); j++) {
                    if (data[j][category_data.default_filtering].length < data[j+1][category_data.default_filtering].length) {
                      [data[j], data[j+1]] = [data[j + 1], data[j]]
                    }
                  }
                }
              }
  
              for (let product of data) {
                filtering = product[category_data.default_filtering]
                if (filtering in sorted_products) {
                  sorted_products[filtering].push(product)
                }
                else {
                  sorted_products[filtering] = [product]
                }
              }
              
              for (let filtering in sorted_products) {
                remainder = sorted_products[filtering].length % 3
                if (remainder != 0) {
                  for (let i = 0; i < 3 - remainder; i++) {
                    sorted_products[filtering].push(null)
                  }
                }
              }
              this.setState({
                products: sorted_products
              })
            })
          })
        })
      })
      return
    }
    this.setState({
      lang: lang,
      category: {
        name: 'sales',
      },
      sub_category: null,
      filter: null
    }, () => {
      getSales().then((data) => {
        let remainder = data.products.length % 3
        if (remainder != 0) {
          for (let i = 0; i < 3 - remainder; i++) {
            data.products.push(null)
          }
        }
        this.setState({
          products: {
            '': data.products
          },
          category: {
            name: 'sales',
            name_s: data.name_s,
            name_pl: data.name_pl,
            default_filtering: '',
            default_filtering_lang: data.name_pl
          }
        })
      })
    })
  }

  updateCurrency(currency) {
    this.setState({
      currency: currency
    })
    this.props.context.updateCurrency(currency)
  }

  updateForm(key, value) {
    let changedForm = {...this.state.form}
    changedForm[key] = value
    this.setState({
      form: changedForm
    })
  }

  submitForm() {
    let r = sendForm({
      'category': this.state.category.name != 'sales' ? this.state.category.name_s : this.state.active.category,
      'product': this.state.active.name,
      'name': this.state.form.name,
      'phone': this.state.form.phone
    }, Cookies.get('csrftoken'), true)

    if (r == 'error: empty') {
      this.updateForm('error', true)
    }
    else {
      $(function () {
        $('#modal').modal('toggle');
     });
    }
  }

  changeLayout() {
    this.setState({
      isGrid: !this.state.isGrid
    })
  }

  render() {
    const t = this.props.t

    return (
      <div className="mt-5">
        <LocationListener locationChanged={this.updateProducts} />
        {!this.isMobile && this.state.category.name !='sales' && <SectionImage category={this.state.category} />}
        <div className="d-flex mt-5 px-2 py-1 px-sm-5 py-sm-4">
          <div className="col-sm-1"></div>
          {this.state.products &&
          <div className="col-sm-10">
            {!this.isMobile && 
            <div className="d-flex flex-row justify-content-end align-items-center h6">
              <div className="d-flex flex-row me-2 me-sm-5 align-items-center">
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
              <div
                onClick={this.changeLayout}
                className={(this.state.isGrid ? "switch-grid" : "switch-column") + " switch d-flex transition"}>
                {[0, 1, 2].map((value) => {
                return <div key={value} className="bg-white transition" />
                })}
              </div>
            </div>
            }
            {Object.keys(this.state.products).map((filtering, index) => {
            return (
            <div key={index} className="d-flex mb-5 flex-column">
              <span className="h4">{this.state.category.default_filtering_lang} {filtering}</span>
              <div className={(this.state.isGrid ? "section-grid" : "section-column") + " d-flex flex-wrap mt-3 justify-content-between transition"}>
              {this.state.products[filtering].map((product, index) => {
              if (product == null) {
                return <div key={index} />
              }
              return (
                <div key={index} className="d-flex shadow no-link mb-3 p-3">
                  <div style={{zIndex: 1000}} className="position-absolute d-flex p-3 h4">
                    <div style={{color: (product.best ? 'gold' : 'var(--milk)')}}>
                      <FontAwesomeIcon icon="fa-star"/>
                    </div>
                    {product.discount != 0 &&
                    <div className="ms-2 ms-sm-4" style={{color: 'var(--deep-sky-blue)', borderBottom: '1px solid var(--deep-sky-blue)'}}>
                      <span>-{product.discount}%</span>
                    </div>
                    }
                  </div>
                  <div className="d-flex row-nowrap">
                    <div className="position-relative d-flex flex-column flex-grow-1 flex-shrink-1">
                      <img src={product.shortcut}/>
                      {this.state.category.name == 'sales' &&
                      <div className="position-absolute bottom-0 start-0 h5">
                        <span>{`${product.size.length} x ${product.size.width}`}</span>
                      </div>
                      }
                    </div>
                    {this.state.isGrid && product.markers &&
                    <div style={{width: this.isMobile ? '50vw' : '12.5vw', height: this.isMobile ? 'calc(50vw + 2.5rem)' : 'calc(12.5vw + 2.5rem)'}} className="d-flex flex-column justify-content-start mt-3">
                      {product.markers.map((marker, index) => {
                        return <img key={index} className="mb-2" src={marker}/>
                      })}
                    </div>
                    }
                  </div>
                  <div className="d-flex mt-3 flex-column justify-content-between">
                    <div className="price d-flex flex-row justify-content-between align-items-end">
                      <div className="h5 m-0">
                        <Hoverable text={product.name} />
                      </div>
                      <div className="d-flex flex-column text-end">
                      {product.discount != 0
                      ?
                        <div className="d-flex flex-column">
                          <div style={{textDecoration: 'line-through'}}>
                            <span>
                              {`${product.size['price' + this.state.currency]} (${this.state.currency})`}
                            </span>
                          </div>
                          <div>
                            <span>
                              {`${this.state.category.name != 'sales' ? t('from') : ''} `}
                            </span>
                            <span style={{color: 'var(--lime-green)'}} className="h5">
                              {product.size['price' + this.state.currency] * (100 - product.discount) / 100}
                            </span>
                            <span>
                              {` (${this.state.currency})`}
                            </span>
                          </div>
                        </div>
                      :
                        <div className="d-flex flex-column">
                          <span>
                            {`${this.state.category.name != 'sales' ? t('from') : ''} ${product.size['price' + this.state.currency]} (${this.state.currency})`}
                          </span>
                        </div>
                      }
                      </div>
                    </div>
                    <div className="desc py-3 border-bottom border-muted">
                      <span>{product.desc}</span>
                    </div>
                    {!this.state.isGrid && product.markers &&
                    <div style={{height: '5vh'}} className="d-flex row-nowrap justify-content-start">
                      {product.markers.map((marker, index) => {
                      return (
                        <img key={index} src={marker} style={{width: '5vh', height: '5vh'}} className="me-2" />
                      )})}
                    </div>
                    }
                    <div className="d-flex mt-4 flex-row row-nowrap justify-content-between h5">
                      {this.state.category.name != 'sales'
                      ?
                      <Link to={`/product/${this.state.category.name}/${product.id}` + location.search}>
                        <CustomButton color="lime-green" text={t('details')} />
                      </Link>
                      :
                      <Link to={`/product/${product.category}/${product.id}` + location.search}>
                        <CustomButton color="lime-green" text={t('details')} />
                      </Link>
                      }
                      <div onClick={() => this.setState({active: product})} data-bs-toggle="modal" data-bs-target="#modal">
                        <CustomButton color="deep-sky-blue" text={t('call')} />
                      </div>
                    </div>
                  </div>
                </div>
              )})}
              </div>
            </div>
            )})}
            </div>
          }
          <div className="col-sm-1"></div>
        </div>
        <div className="modal fade" id="modal" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <span className="modal-title h5" id="modalLabel">{t('call') + ` (${this.state.active?.name})`}</span>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <span>{t('desc')}</span>
                <br/>
                <span className="h6 text-danger">{this.state.form.error ? t('error') : ''}</span>
                <form className="mt-3">
                  <label htmlFor="name">{t('name')}</label>
                  <br/>
                  <input
                    style={{border: 'none', borderBottom: '1px solid var(--dark-cyan)'}}
                    className="outline-0 no-hover w-100 px-0 mb-3"
                    type="text"
                    name="name"
                    placeholder="..."
                    value={this.state.form.name}
                    onChange={e => this.updateForm('name', e.target.value)}
                  />
                  <CustomPhoneInput
                    lang={this.state.lang}
                    color="dark-cyan" 
                    value={this.state.form.phone}
                    setPhone={phone => this.updateForm('phone', phone)}
                  />
                </form>
              </div>
              <div className="d-flex justify-content-between modal-footer">
                <div data-bs-dismiss="modal">
                  <CustomButton color="lime-green" text={t('close')} />
                </div>
                <div onClick={this.submitForm}>
                  <CustomButton color="deep-sky-blue" text={t('submit')} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation('catalog')(withParams(Catalog));
